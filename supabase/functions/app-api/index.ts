import {
  buildWeekLabel,
  cleanupExpiredAuthArtifacts,
  corsHeaders,
  createAdminClient,
  extractBearerToken,
  extractPendingToken,
  isLoginEnabledMember,
  issueAppSession,
  jsonResponse,
  MemberDirectoryRow,
  sha256Hex,
} from "../_shared/common.ts";

type AppSessionRow = {
  id: string;
  member_id: number;
  line_user_id: string;
  expires_at: string;
  revoked_at: string | null;
};

type PendingLoginRow = {
  id: string;
  token_hash: string;
  line_user_id: string;
  display_name: string;
  picture_url: string;
  redirect_to: string;
  expires_at: string;
  consumed_at: string | null;
};

type InviteMemberRow = {
  id: number;
  full_name: string;
  role: string;
  is_admin: boolean;
  is_active: boolean;
  line_user_id: string | null;
};

type InviteRow = {
  id: string;
  member_id: number;
  invite_code: string;
  expires_at: string;
  used_at: string | null;
  used_by_line_user_id: string | null;
  created_by_member_id: number | null;
  created_at: string;
  members: InviteMemberRow | InviteMemberRow[];
};

type DistrictRow = {
  id: number;
  name: string;
  description: string;
};

type BigFamilyRow = {
  id: number;
  district_id: number;
  name: string;
  description: string;
};

type SmallGroupRow = {
  id: number;
  district_id: number;
  big_family_id: number | null;
  name: string;
  description: string;
};

const VALID_ATTENDANCE_STATUS = new Set(["unknown", "present", "absent"]);
const LOGIN_CAPABLE_ROLES = new Set([
  "district_leader",
  "big_family_leader",
  "small_group_leader",
]);

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const adminClient = createAdminClient();
    await cleanupExpiredAuthArtifacts(adminClient);

    const url = new URL(request.url);
    const action = url.searchParams.get("action") || "";

    if (request.method === "GET" && action === "session") {
      return await handleGetSession(adminClient, request.headers);
    }

    if (request.method === "GET" && action === "dashboard") {
      return await handleGetDashboard(adminClient, request.headers, url);
    }

    if (request.method === "GET" && action === "admin-overview") {
      return await handleGetAdminOverview(adminClient, request.headers);
    }

    if (request.method === "POST" && action === "bind") {
      return await handleBindInvite(adminClient, request);
    }

    if (request.method === "POST" && action === "logout") {
      return await handleLogout(adminClient, request.headers);
    }

    if (request.method === "POST" && action === "save-attendance") {
      return await handleSaveAttendance(adminClient, request);
    }

    if (request.method === "POST" && action === "create-district") {
      return await handleCreateDistrict(adminClient, request);
    }

    if (request.method === "POST" && action === "update-district") {
      return await handleUpdateDistrict(adminClient, request);
    }

    if (request.method === "POST" && action === "create-big-family") {
      return await handleCreateBigFamily(adminClient, request);
    }

    if (request.method === "POST" && action === "update-big-family") {
      return await handleUpdateBigFamily(adminClient, request);
    }

    if (request.method === "POST" && action === "create-small-group") {
      return await handleCreateSmallGroup(adminClient, request);
    }

    if (request.method === "POST" && action === "update-small-group") {
      return await handleUpdateSmallGroup(adminClient, request);
    }

    if (request.method === "POST" && action === "create-member") {
      return await handleCreateMember(adminClient, request);
    }

    if (request.method === "POST" && action === "update-member") {
      return await handleUpdateMember(adminClient, request);
    }

    if (request.method === "POST" && action === "create-invite") {
      return await handleCreateInvite(adminClient, request);
    }

    return jsonResponse({ error: "Unknown action." }, 404);
  } catch (error) {
    console.error(error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unexpected error." },
      500,
    );
  }
});

async function handleGetSession(
  adminClient: ReturnType<typeof createAdminClient>,
  headers: Headers,
) {
  const sessionContext = await getSessionContext(adminClient, headers);
  if (sessionContext) {
    return jsonResponse({
      status: "authenticated",
      current_member: sessionContext.member,
    });
  }

  const pendingContext = await getPendingContext(adminClient, headers);
  if (pendingContext) {
    return jsonResponse({
      status: "pending_binding",
      pending_profile: {
        line_user_id: pendingContext.pending.line_user_id,
        display_name: pendingContext.pending.display_name,
        picture_url: pendingContext.pending.picture_url,
      },
    });
  }

  return jsonResponse({ status: "signed_out" });
}

async function handleGetDashboard(
  adminClient: ReturnType<typeof createAdminClient>,
  headers: Headers,
  url: URL,
) {
  const sessionContext = await getSessionContext(adminClient, headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const requestedWeek = url.searchParams.get("week_start");
  const weekStart = requestedWeek
    ? getMondayIso(requestedWeek)
    : getMondayIso(new Date());
  const week = await ensureWeek(adminClient, weekStart);
  const rosterMembers = await loadVisibleMembers(adminClient, sessionContext.member);
  const attendanceMap = await loadAttendanceMap(
    adminClient,
    week.id,
    rosterMembers.map((member) => member.id),
  );

  const roster = rosterMembers.map((member) => ({
    ...member,
    can_edit_attendance: canEditAttendance(sessionContext.member, member),
    can_edit_note: canEditNote(sessionContext.member, member),
    attendance: {
      sunday_service:
        attendanceMap.get(`${member.id}:sunday_service`) || "unknown",
      small_group_fellowship:
        attendanceMap.get(`${member.id}:small_group_fellowship`) || "unknown",
    },
  }));

  return jsonResponse({
    current_member: sessionContext.member,
    week,
    roster,
  });
}

async function handleGetAdminOverview(
  adminClient: ReturnType<typeof createAdminClient>,
  headers: Headers,
) {
  const sessionContext = await getSessionContext(adminClient, headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!canUseAdminPanel(sessionContext.member)) {
    return jsonResponse({ error: "Forbidden." }, 403);
  }

  const overview = await buildAdminOverview(adminClient, sessionContext.member);
  return jsonResponse(overview);
}

async function handleBindInvite(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const pendingContext = await getPendingContext(adminClient, request.headers);
  if (!pendingContext) {
    return jsonResponse({ error: "Pending LINE login is missing or expired." }, 401);
  }

  const body = await request.json().catch(() => null);
  const inviteCode = String(body?.invite_code || "").trim().toUpperCase();
  if (!inviteCode) {
    return jsonResponse({ error: "invite_code is required." }, 400);
  }

  const { data: invite, error: inviteError } = await adminClient
    .from("login_invites")
    .select(
      `
        id,
        member_id,
        invite_code,
        expires_at,
        used_at,
        used_by_line_user_id,
        created_by_member_id,
        created_at,
        members!inner (
          id,
          full_name,
          role,
          is_admin,
          is_active,
          line_user_id
        )
      `,
    )
    .eq("invite_code", inviteCode)
    .maybeSingle();

  if (inviteError) {
    return jsonResponse({ error: inviteError.message }, 500);
  }

  if (!invite) {
    return jsonResponse({ error: "找不到此邀請碼。" }, 404);
  }

  const inviteRow = invite as InviteRow;
  const inviteMember = Array.isArray(inviteRow.members)
    ? inviteRow.members[0]
    : inviteRow.members;

  if (!inviteMember || !inviteMember.is_active) {
    return jsonResponse({ error: "此邀請碼對應的人員已停用。" }, 409);
  }

  if (!isLoginEnabledMember(inviteMember)) {
    return jsonResponse({ error: "此人員角色不開放登入。" }, 409);
  }

  if (inviteRow.used_at) {
    return jsonResponse({ error: "此邀請碼已被使用。" }, 409);
  }

  if (new Date(inviteRow.expires_at).getTime() < Date.now()) {
    return jsonResponse({ error: "此邀請碼已過期。" }, 410);
  }

  const { data: existingByLineUserId, error: existingByLineUserIdError } =
    await adminClient
      .from("members")
      .select("id")
      .eq("line_user_id", pendingContext.pending.line_user_id)
      .maybeSingle();

  if (existingByLineUserIdError) {
    return jsonResponse({ error: existingByLineUserIdError.message }, 500);
  }

  if (existingByLineUserId && existingByLineUserId.id !== inviteRow.member_id) {
    return jsonResponse({ error: "此 LINE 帳號已綁定其他人員。" }, 409);
  }

  if (
    inviteMember.line_user_id &&
    inviteMember.line_user_id !== pendingContext.pending.line_user_id
  ) {
    return jsonResponse({ error: "此人員已綁定其他 LINE 帳號。" }, 409);
  }

  const nowIso = new Date().toISOString();
  const { data: updatedMember, error: updateMemberError } = await adminClient
    .from("members")
    .update({
      line_user_id: pendingContext.pending.line_user_id,
      last_line_login_at: nowIso,
    })
    .eq("id", inviteRow.member_id)
    .select("id")
    .single();

  if (updateMemberError) {
    return jsonResponse({ error: updateMemberError.message }, 500);
  }

  const { data: updatedMemberDirectory, error: updatedMemberDirectoryError } =
    await adminClient
      .from("member_directory")
      .select("*")
      .eq("id", updatedMember.id)
      .single();

  if (updatedMemberDirectoryError) {
    return jsonResponse({ error: updatedMemberDirectoryError.message }, 500);
  }

  const { error: inviteUpdateError } = await adminClient
    .from("login_invites")
    .update({
      used_at: nowIso,
      used_by_line_user_id: pendingContext.pending.line_user_id,
    })
    .eq("id", inviteRow.id);

  if (inviteUpdateError) {
    return jsonResponse({ error: inviteUpdateError.message }, 500);
  }

  const { error: consumePendingError } = await adminClient
    .from("line_pending_logins")
    .update({ consumed_at: nowIso })
    .eq("id", pendingContext.pending.id);

  if (consumePendingError) {
    return jsonResponse({ error: consumePendingError.message }, 500);
  }

  const session = await issueAppSession(adminClient, {
    id: inviteRow.member_id,
    line_user_id: pendingContext.pending.line_user_id,
  });

  return jsonResponse({
    status: "authenticated",
    app_token: session.appToken,
    current_member: updatedMemberDirectory,
  });
}

async function handleLogout(
  adminClient: ReturnType<typeof createAdminClient>,
  headers: Headers,
) {
  const rawToken = extractBearerToken(headers);
  if (!rawToken) {
    return jsonResponse({ status: "signed_out" });
  }

  const tokenHash = await sha256Hex(rawToken);
  await adminClient
    .from("app_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("token_hash", tokenHash)
    .is("revoked_at", null);

  return jsonResponse({ status: "signed_out" });
}

async function handleSaveAttendance(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const body = await request.json().catch(() => null);
  const weekStart = getMondayIso(String(body?.week_start || new Date()));
  const entries = Array.isArray(body?.entries) ? body.entries : [];

  if (!entries.length) {
    return jsonResponse({ error: "entries is required." }, 400);
  }

  const week = await ensureWeek(adminClient, weekStart);
  const rosterMembers = await loadVisibleMembers(adminClient, sessionContext.member);
  const visibleMembers = new Map(rosterMembers.map((member) => [member.id, member]));
  const notesToUpdate: Array<{ member_id: number; note: string }> = [];

  const rowsToUpsert: Array<{
    member_id: number;
    attendance_week_id: number;
    event_type: "sunday_service" | "small_group_fellowship";
    status: "unknown" | "present" | "absent";
    recorded_by_member_id: number;
    recorded_at: string;
  }> = [];

  for (const entry of entries) {
    const memberId = Number(entry?.member_id);
    const targetMember = visibleMembers.get(memberId);
    if (!targetMember) {
      return jsonResponse(
        { error: `No permission to access member ${memberId}.` },
        403,
      );
    }

    const sundayStatus = normalizeAttendanceStatus(entry?.sunday_service);
    const fellowshipStatus = normalizeAttendanceStatus(
      entry?.small_group_fellowship,
    );
    const note = String(entry?.note || "").trim();
    const nowIso = new Date().toISOString();

    if (canEditNote(sessionContext.member, targetMember)) {
      notesToUpdate.push({
        member_id: memberId,
        note,
      });
    }

    if (canEditAttendance(sessionContext.member, targetMember)) {
      rowsToUpsert.push(
        {
          member_id: memberId,
          attendance_week_id: week.id,
          event_type: "sunday_service",
          status: sundayStatus,
          recorded_by_member_id: sessionContext.member.id,
          recorded_at: nowIso,
        },
        {
          member_id: memberId,
          attendance_week_id: week.id,
          event_type: "small_group_fellowship",
          status: fellowshipStatus,
          recorded_by_member_id: sessionContext.member.id,
          recorded_at: nowIso,
        },
      );
    }
  }

  if (rowsToUpsert.length) {
    const { error } = await adminClient.from("attendance_records").upsert(
      rowsToUpsert,
      {
        onConflict: "member_id,attendance_week_id,event_type",
      },
    );

    if (error) {
      return jsonResponse({ error: error.message }, 500);
    }
  }

  for (const noteUpdate of notesToUpdate) {
    const { error: noteError } = await adminClient
      .from("members")
      .update({ note: noteUpdate.note })
      .eq("id", noteUpdate.member_id);

    if (noteError) {
      return jsonResponse({ error: noteError.message }, 500);
    }
  }

  return jsonResponse({
    status: "ok",
    message: "本週點名已儲存。",
  });
}

async function handleCreateDistrict(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!sessionContext.member.is_admin) {
    return jsonResponse({ error: "Only admins can create districts." }, 403);
  }

  const body = await request.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const description = String(body?.description || "").trim();
  if (!name) {
    return jsonResponse({ error: "District name is required." }, 400);
  }

  const { data, error } = await adminClient
    .from("districts")
    .insert({
      name,
      description,
    })
    .select("*")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ district: data });
}

async function handleUpdateDistrict(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!sessionContext.member.is_admin) {
    return jsonResponse({ error: "Only admins can edit districts." }, 403);
  }

  const body = await request.json().catch(() => null);
  const districtId = toPositiveInt(body?.district_id);
  const name = String(body?.name || "").trim();
  const description = String(body?.description || "").trim();
  if (!districtId || !name) {
    return jsonResponse({ error: "district_id and name are required." }, 400);
  }

  const district = await fetchDistrict(adminClient, districtId);
  if (!district) {
    return jsonResponse({ error: "District not found." }, 404);
  }

  const { data, error } = await adminClient
    .from("districts")
    .update({
      name,
      description,
    })
    .eq("id", district.id)
    .select("*")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ district: data });
}

async function handleCreateBigFamily(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!canUseAdminPanel(sessionContext.member)) {
    return jsonResponse({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
  const districtId = toPositiveInt(body?.district_id);
  const name = String(body?.name || "").trim();
  const description = String(body?.description || "").trim();
  if (!districtId || !name) {
    return jsonResponse({ error: "district_id and name are required." }, 400);
  }

  const district = await fetchDistrict(adminClient, districtId);
  if (!district) {
    return jsonResponse({ error: "District not found." }, 404);
  }

  if (!canManageDistrict(sessionContext.member, district.id)) {
    return jsonResponse({ error: "No permission to create in this district." }, 403);
  }

  const { data, error } = await adminClient
    .from("big_families")
    .insert({
      district_id: district.id,
      name,
      description,
    })
    .select("*")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ big_family: data });
}

async function handleUpdateBigFamily(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!canUseAdminPanel(sessionContext.member)) {
    return jsonResponse({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
  const bigFamilyId = toPositiveInt(body?.big_family_id);
  const name = String(body?.name || "").trim();
  const description = String(body?.description || "").trim();
  if (!bigFamilyId || !name) {
    return jsonResponse({ error: "big_family_id and name are required." }, 400);
  }

  const bigFamily = await fetchBigFamily(adminClient, bigFamilyId);
  if (!bigFamily) {
    return jsonResponse({ error: "Big family not found." }, 404);
  }

  if (!canManageDistrict(sessionContext.member, bigFamily.district_id)) {
    return jsonResponse({ error: "No permission to edit this big family." }, 403);
  }

  const { data, error } = await adminClient
    .from("big_families")
    .update({
      name,
      description,
    })
    .eq("id", bigFamily.id)
    .select("*")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ big_family: data });
}

async function handleCreateSmallGroup(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!canUseAdminPanel(sessionContext.member)) {
    return jsonResponse({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
  const bigFamilyId = toPositiveInt(body?.big_family_id);
  const districtId = toPositiveInt(body?.district_id);
  const name = String(body?.name || "").trim();
  const description = String(body?.description || "").trim();
  if (!name || (!bigFamilyId && !districtId)) {
    return jsonResponse(
      { error: "name and either big_family_id or district_id are required." },
      400,
    );
  }

  let targetDistrictId = 0;
  if (bigFamilyId) {
    const bigFamily = await fetchBigFamily(adminClient, bigFamilyId);
    if (!bigFamily) {
      return jsonResponse({ error: "Big family not found." }, 404);
    }

    targetDistrictId = bigFamily.district_id;
    if (!canManageDistrict(sessionContext.member, bigFamily.district_id)) {
      return jsonResponse(
        { error: "No permission to create small groups in this district." },
        403,
      );
    }
  } else {
    const district = await fetchDistrict(adminClient, districtId);
    if (!district) {
      return jsonResponse({ error: "District not found." }, 404);
    }

    targetDistrictId = district.id;
    if (!canManageDistrict(sessionContext.member, district.id)) {
      return jsonResponse(
        { error: "No permission to create small groups in this district." },
        403,
      );
    }
  }

  const { data, error } = await adminClient
    .from("small_groups")
    .insert({
      district_id: targetDistrictId,
      big_family_id: bigFamilyId || null,
      name,
      description,
    })
    .select("*")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ small_group: data });
}

async function handleUpdateSmallGroup(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!canUseAdminPanel(sessionContext.member)) {
    return jsonResponse({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
  const smallGroupId = toPositiveInt(body?.small_group_id);
  const name = String(body?.name || "").trim();
  const description = String(body?.description || "").trim();
  if (!smallGroupId || !name) {
    return jsonResponse({ error: "small_group_id and name are required." }, 400);
  }

  const smallGroup = await fetchSmallGroup(adminClient, smallGroupId);
  if (!smallGroup) {
    return jsonResponse({ error: "Small group not found." }, 404);
  }

  if (!canManageDistrict(sessionContext.member, smallGroup.district_id)) {
    return jsonResponse({ error: "No permission to edit this small group." }, 403);
  }

  const { data, error } = await adminClient
    .from("small_groups")
    .update({
      name,
      description,
    })
    .eq("id", smallGroup.id)
    .select("*")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ small_group: data });
}

async function handleCreateMember(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!canUseAdminPanel(sessionContext.member)) {
    return jsonResponse({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
  const fullName = String(body?.full_name || "").trim();
  const role = normalizeRole(body?.role);
  const isAdmin = Boolean(body?.is_admin);
  const birthday = body?.birthday ? String(body.birthday) : null;
  const gender = normalizeGender(body?.gender);
  const note = String(body?.note || "").trim();

  if (!fullName || !role) {
    return jsonResponse({ error: "full_name and role are required." }, 400);
  }

  if (!canCreateRole(sessionContext.member, role, isAdmin)) {
    return jsonResponse({ error: "No permission to create this role." }, 403);
  }

  const scope = await resolveMemberScope(adminClient, body, role, {
    autoCreate: true,
    fullName,
  });
  if (!scope) {
    return jsonResponse({ error: "Invalid hierarchy scope for this role." }, 400);
  }

  if (!canManageDistrict(sessionContext.member, scope.district_id)) {
    return jsonResponse({ error: "No permission to create in this district." }, 403);
  }

  const { data, error } = await adminClient
    .from("members")
    .insert({
      full_name: fullName,
      birthday,
      gender,
      note,
      role,
      is_admin: sessionContext.member.is_admin ? isAdmin : false,
      district_id: scope.district_id,
      big_family_id: scope.big_family_id,
      small_group_id: scope.small_group_id,
    })
    .select("*")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ member: data });
}

async function handleUpdateMember(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!canUseAdminPanel(sessionContext.member)) {
    return jsonResponse({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
  const memberId = toPositiveInt(body?.member_id);
  if (!memberId) {
    return jsonResponse({ error: "member_id is required." }, 400);
  }

  const { data: targetMember, error: targetMemberError } = await adminClient
    .from("member_directory")
    .select("*")
    .eq("id", memberId)
    .maybeSingle();

  if (targetMemberError) {
    return jsonResponse({ error: targetMemberError.message }, 500);
  }

  if (!targetMember) {
    return jsonResponse({ error: "Member not found." }, 404);
  }

  if (!canEditProfile(sessionContext.member, targetMember)) {
    return jsonResponse({ error: "No permission to edit this member." }, 403);
  }

  const requestedRole = normalizeRole(body?.role);
  const targetRole = sessionContext.member.is_admin
    ? requestedRole || targetMember.role
    : targetMember.role;

  if (!sessionContext.member.is_admin && requestedRole && requestedRole !== targetMember.role) {
    return jsonResponse({ error: "District leaders cannot change role." }, 403);
  }

  const scope = await resolveMemberScope(adminClient, body, targetRole, {
    autoCreate: false,
    fullName: String(body?.full_name || targetMember.full_name).trim(),
  });
  if (!scope) {
    return jsonResponse({ error: "Invalid hierarchy scope for this role." }, 400);
  }

  if (!canManageDistrict(sessionContext.member, scope.district_id)) {
    return jsonResponse({ error: "No permission to edit this district." }, 403);
  }

  const updatePayload = {
    full_name: String(body?.full_name || targetMember.full_name).trim(),
    birthday: body?.birthday ? String(body.birthday) : null,
    gender: normalizeGender(body?.gender),
    note: String(body?.note || "").trim(),
    role: targetRole,
    is_admin: sessionContext.member.is_admin
      ? Boolean(body?.is_admin)
      : targetMember.is_admin,
    is_active: sessionContext.member.is_admin
      ? Boolean(body?.is_active)
      : Boolean(body?.is_active ?? targetMember.is_active),
    district_id: scope.district_id,
    big_family_id: scope.big_family_id,
    small_group_id: scope.small_group_id,
  };

  const { error: updateError } = await adminClient
    .from("members")
    .update(updatePayload)
    .eq("id", targetMember.id);

  if (updateError) {
    return jsonResponse({ error: updateError.message }, 500);
  }

  const { data: updatedMember, error: updatedMemberError } = await adminClient
    .from("member_directory")
    .select("*")
    .eq("id", targetMember.id)
    .single();

  if (updatedMemberError) {
    return jsonResponse({ error: updatedMemberError.message }, 500);
  }

  return jsonResponse({ member: updatedMember });
}

async function handleCreateInvite(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!canUseAdminPanel(sessionContext.member)) {
    return jsonResponse({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
  const memberId = toPositiveInt(body?.member_id);
  const expiresInDays = Math.min(Math.max(toPositiveInt(body?.expires_in_days) || 7, 1), 30);
  if (!memberId) {
    return jsonResponse({ error: "member_id is required." }, 400);
  }

  const { data: targetMember, error: targetMemberError } = await adminClient
    .from("member_directory")
    .select("*")
    .eq("id", memberId)
    .maybeSingle();

  if (targetMemberError) {
    return jsonResponse({ error: targetMemberError.message }, 500);
  }

  if (!targetMember) {
    return jsonResponse({ error: "Member not found." }, 404);
  }

  if (!isLoginEnabledMember(targetMember)) {
    return jsonResponse({ error: "This member does not need an invite code." }, 409);
  }

  if (!canIssueInvite(sessionContext.member, targetMember)) {
    return jsonResponse({ error: "No permission to issue invite for this member." }, 403);
  }

  if (targetMember.line_user_id) {
    return jsonResponse({ error: "This member is already bound to LINE." }, 409);
  }

  const expiresAt = new Date(
    Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: invite, error } = await adminClient
    .from("login_invites")
    .insert({
      member_id: targetMember.id,
      expires_at: expiresAt,
      created_by_member_id: sessionContext.member.id,
    })
    .select("*")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({
    invite: {
      id: invite.id,
      invite_code: invite.invite_code,
      expires_at: invite.expires_at,
      target_name: targetMember.full_name,
      target_role: targetMember.role,
    },
  });
}

async function getSessionContext(
  adminClient: ReturnType<typeof createAdminClient>,
  headers: Headers,
) {
  const rawToken = extractBearerToken(headers);
  if (!rawToken) {
    return null;
  }

  const tokenHash = await sha256Hex(rawToken);
  const nowIso = new Date().toISOString();

  const { data: sessionRow, error: sessionError } = await adminClient
    .from("app_sessions")
    .select("id, member_id, line_user_id, expires_at, revoked_at")
    .eq("token_hash", tokenHash)
    .is("revoked_at", null)
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (sessionError || !sessionRow) {
    return null;
  }

  const { data: memberRow, error: memberError } = await adminClient
    .from("member_directory")
    .select("*")
    .eq("id", sessionRow.member_id)
    .maybeSingle();

  if (memberError || !memberRow || !isLoginEnabledMember(memberRow)) {
    await adminClient
      .from("app_sessions")
      .update({ revoked_at: nowIso })
      .eq("id", sessionRow.id)
      .is("revoked_at", null);
    return null;
  }

  await adminClient
    .from("app_sessions")
    .update({ last_seen_at: nowIso })
    .eq("id", sessionRow.id);

  return {
    session: sessionRow as AppSessionRow,
    member: memberRow as MemberDirectoryRow,
  };
}

async function getPendingContext(
  adminClient: ReturnType<typeof createAdminClient>,
  headers: Headers,
) {
  const rawToken = extractPendingToken(headers);
  if (!rawToken) {
    return null;
  }

  const tokenHash = await sha256Hex(rawToken);
  const nowIso = new Date().toISOString();

  const { data: pendingRow, error } = await adminClient
    .from("line_pending_logins")
    .select("*")
    .eq("token_hash", tokenHash)
    .is("consumed_at", null)
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (error || !pendingRow) {
    return null;
  }

  return {
    pending: pendingRow as PendingLoginRow,
  };
}

async function ensureWeek(
  adminClient: ReturnType<typeof createAdminClient>,
  weekStart: string,
) {
  const { data, error } = await adminClient
    .from("attendance_weeks")
    .select("*")
    .eq("week_start_date", weekStart)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    return data;
  }

  const insertPayload = {
    week_start_date: weekStart,
    label: buildWeekLabel(weekStart),
  };

  const { data: inserted, error: insertError } = await adminClient
    .from("attendance_weeks")
    .insert(insertPayload)
    .select("*")
    .single();

  if (!insertError) {
    return inserted;
  }

  const fallback = await adminClient
    .from("attendance_weeks")
    .select("*")
    .eq("week_start_date", weekStart)
    .single();

  if (fallback.error) {
    throw new Error(insertError.message);
  }

  return fallback.data;
}

async function loadVisibleMembers(
  adminClient: ReturnType<typeof createAdminClient>,
  viewer: MemberDirectoryRow,
) {
  let query = adminClient
    .from("member_directory")
    .select("*")
    .eq("is_active", true);

  if (viewer.is_admin) {
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    return (data || []).filter((member) => member.id !== viewer.id);
  }

  if (viewer.role === "district_leader") {
    query = query
      .eq("district_id", viewer.district_id)
      .in("role", ["big_family_leader", "small_group_leader", "member", "best"]);
  } else if (viewer.role === "big_family_leader") {
    query = query
      .eq("big_family_id", viewer.big_family_id)
      .in("role", ["small_group_leader", "member", "best"]);
  } else if (viewer.role === "small_group_leader") {
    query = query
      .eq("small_group_id", viewer.small_group_id)
      .in("role", ["member", "best"]);
  } else {
    return [];
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return (data || []).filter((member) => member.id !== viewer.id);
}

async function loadAttendanceMap(
  adminClient: ReturnType<typeof createAdminClient>,
  attendanceWeekId: number,
  memberIds: number[],
) {
  const map = new Map<string, "unknown" | "present" | "absent">();
  if (!memberIds.length) {
    return map;
  }

  const { data, error } = await adminClient
    .from("attendance_records")
    .select("member_id, event_type, status")
    .eq("attendance_week_id", attendanceWeekId)
    .in("member_id", memberIds);

  if (error) {
    throw new Error(error.message);
  }

  for (const row of data || []) {
    map.set(
      `${row.member_id}:${row.event_type}`,
      row.status as "unknown" | "present" | "absent",
    );
  }

  return map;
}

function canEditAttendance(viewer: MemberDirectoryRow, target: MemberDirectoryRow) {
  if (!target.is_active || target.id === viewer.id) {
    return false;
  }

  if (viewer.is_admin) {
    return true;
  }

  if (viewer.role === "district_leader") {
    return (
      viewer.district_id === target.district_id &&
      ["big_family_leader", "small_group_leader", "member", "best"].includes(
        target.role,
      )
    );
  }

  if (viewer.role === "big_family_leader") {
    return (
      viewer.big_family_id === target.big_family_id &&
      ["small_group_leader", "member", "best"].includes(target.role)
    );
  }

  if (viewer.role === "small_group_leader") {
    return (
      viewer.small_group_id === target.small_group_id &&
      ["member", "best"].includes(target.role)
    );
  }

  return false;
}

function canEditNote(viewer: MemberDirectoryRow, target: MemberDirectoryRow) {
  if (!target.is_active || target.id === viewer.id) {
    return false;
  }

  if (viewer.is_admin) {
    return true;
  }

  if (viewer.role === "district_leader") {
    return viewer.district_id === target.district_id;
  }

  if (viewer.role === "big_family_leader") {
    return viewer.big_family_id === target.big_family_id;
  }

  if (viewer.role === "small_group_leader") {
    return viewer.small_group_id === target.small_group_id;
  }

  return false;
}

function canUseAdminPanel(viewer: MemberDirectoryRow) {
  return viewer.is_admin || viewer.role === "district_leader";
}

function canManageDistrict(viewer: MemberDirectoryRow, districtId: number) {
  return viewer.is_admin || viewer.district_id === districtId;
}

function canCreateRole(
  viewer: MemberDirectoryRow,
  role: string,
  isAdminFlag: boolean,
) {
  if (!canUseAdminPanel(viewer)) {
    return false;
  }

  if (viewer.is_admin) {
    return true;
  }

  if (isAdminFlag) {
    return false;
  }

  return [
    "big_family_leader",
    "small_group_leader",
    "member",
    "best",
  ].includes(role);
}

function canIssueInvite(viewer: MemberDirectoryRow, target: MemberDirectoryRow) {
  if (viewer.is_admin) {
    return isLoginEnabledMember(target);
  }

  return (
    viewer.role === "district_leader" &&
    target.district_id === viewer.district_id &&
    ["big_family_leader", "small_group_leader"].includes(target.role)
  );
}

function canEditProfile(viewer: MemberDirectoryRow, target: MemberDirectoryRow) {
  if (viewer.is_admin) {
    return true;
  }

  return (
    viewer.role === "district_leader" &&
    target.district_id === viewer.district_id &&
    ["member", "best"].includes(target.role)
  );
}

async function buildAdminOverview(
  adminClient: ReturnType<typeof createAdminClient>,
  viewer: MemberDirectoryRow,
) {
  const districts = await loadManagedDistricts(adminClient, viewer);
  const districtIds = districts.map((district) => district.id);

  const { data: bigFamilies, error: bigFamilyError } = await adminClient
    .from("big_families")
    .select("id, district_id, name, description")
    .in("district_id", districtIds.length ? districtIds : [-1])
    .order("name");

  if (bigFamilyError) {
    throw new Error(bigFamilyError.message);
  }

  const bigFamilyMap = new Map((bigFamilies || []).map((item) => [item.id, item]));

  const { data: smallGroups, error: smallGroupError } = await adminClient
    .from("small_groups")
    .select("id, district_id, big_family_id, name, description")
    .in("district_id", districtIds.length ? districtIds : [-1])
    .order("name");

  if (smallGroupError) {
    throw new Error(smallGroupError.message);
  }

  const { data: members, error: memberError } = await adminClient
    .from("member_directory")
    .select("*")
    .in("district_id", districtIds.length ? districtIds : [-1])
    .order("full_name");

  if (memberError) {
    throw new Error(memberError.message);
  }

  const memberMap = new Map((members || []).map((member) => [member.id, member]));
  const { data: inviteRows, error: inviteError } = await adminClient
    .from("login_invites")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (inviteError) {
    throw new Error(inviteError.message);
  }

  const creatorIds = Array.from(
    new Set(
      (inviteRows || [])
        .map((invite) => invite.created_by_member_id)
        .filter(Boolean),
    ),
  );
  const { data: creatorMembers, error: creatorError } = await adminClient
    .from("members")
    .select("id, full_name")
    .in("id", creatorIds.length ? creatorIds : [-1]);

  if (creatorError) {
    throw new Error(creatorError.message);
  }

  const creatorMap = new Map(
    (creatorMembers || []).map((creator) => [creator.id, creator.full_name]),
  );

  const invites = (inviteRows || [])
    .map((invite) => {
      const target = memberMap.get(invite.member_id);
      if (!target) {
        return null;
      }

      return {
        id: invite.id,
        invite_code: invite.invite_code,
        expires_at: invite.expires_at,
        used_at: invite.used_at,
        used_by_line_user_id: invite.used_by_line_user_id,
        target_member_id: target.id,
        target_name: target.full_name,
        target_role: target.role,
        created_by_name: invite.created_by_member_id
          ? creatorMap.get(invite.created_by_member_id) || "-"
          : "-",
        created_at: invite.created_at,
      };
    })
    .filter(Boolean);

  return {
    districts,
    big_families: (bigFamilies || []).map((bigFamily) => ({
      ...bigFamily,
      district_name: districts.find((district) => district.id === bigFamily.district_id)
        ?.name || null,
    })),
    small_groups: (smallGroups || []).map((smallGroup) => ({
      ...smallGroup,
      district_name:
        districts.find((district) => district.id === smallGroup.district_id)?.name ||
        null,
      big_family_name: smallGroup.big_family_id
        ? bigFamilyMap.get(smallGroup.big_family_id)?.name || null
        : null,
    })),
    members: members || [],
    invites,
  };
}

async function loadManagedDistricts(
  adminClient: ReturnType<typeof createAdminClient>,
  viewer: MemberDirectoryRow,
) {
  const query = adminClient.from("districts").select("*").order("name");
  if (viewer.is_admin) {
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  const { data, error } = await adminClient
    .from("districts")
    .select("*")
    .eq("id", viewer.district_id)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

async function fetchDistrict(
  adminClient: ReturnType<typeof createAdminClient>,
  districtId: number,
) {
  const { data, error } = await adminClient
    .from("districts")
    .select("*")
    .eq("id", districtId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as DistrictRow | null;
}

async function fetchBigFamily(
  adminClient: ReturnType<typeof createAdminClient>,
  bigFamilyId: number,
) {
  const { data, error } = await adminClient
    .from("big_families")
    .select("*")
    .eq("id", bigFamilyId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as BigFamilyRow | null;
}

async function fetchSmallGroup(
  adminClient: ReturnType<typeof createAdminClient>,
  smallGroupId: number,
) {
  const { data, error } = await adminClient
    .from("small_groups")
    .select("*")
    .eq("id", smallGroupId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as SmallGroupRow | null;
}

async function resolveMemberScope(
  adminClient: ReturnType<typeof createAdminClient>,
  body: any,
  role: string,
  options: { autoCreate: boolean; fullName: string },
) {
  const explicitDistrictId = toPositiveInt(body?.district_id);
  const explicitBigFamilyId = toPositiveInt(body?.big_family_id);
  const explicitSmallGroupId = toPositiveInt(body?.small_group_id);

  if (role === "district_leader") {
    if (explicitDistrictId) {
      const district = await fetchDistrict(adminClient, explicitDistrictId);
      if (!district) {
        return null;
      }

      return {
        district_id: district.id,
        big_family_id: null,
        small_group_id: null,
      };
    }

    if (!options.autoCreate || !options.fullName) {
      return null;
    }

    const { data: createdDistrict, error } = await adminClient
      .from("districts")
      .insert({
        name: `${options.fullName}區`,
        description: "",
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      district_id: createdDistrict.id,
      big_family_id: null,
      small_group_id: null,
    };
  }

  if (role === "big_family_leader") {
    if (explicitBigFamilyId) {
      const bigFamily = await fetchBigFamily(adminClient, explicitBigFamilyId);
      if (!bigFamily) {
        return null;
      }

      if (explicitDistrictId && explicitDistrictId !== bigFamily.district_id) {
        return null;
      }

      return {
        district_id: bigFamily.district_id,
        big_family_id: bigFamily.id,
        small_group_id: null,
      };
    }

    if (!explicitDistrictId || !options.autoCreate || !options.fullName) {
      return null;
    }

    const district = await fetchDistrict(adminClient, explicitDistrictId);
    if (!district) {
      return null;
    }

    const { data: createdBigFamily, error } = await adminClient
      .from("big_families")
      .insert({
        district_id: district.id,
        name: `${options.fullName}大家`,
        description: "",
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      district_id: district.id,
      big_family_id: createdBigFamily.id,
      small_group_id: null,
    };
  }

  if (role === "small_group_leader") {
    if (explicitSmallGroupId) {
      const smallGroup = await fetchSmallGroup(adminClient, explicitSmallGroupId);
      if (!smallGroup) {
        return null;
      }

      const bigFamily = smallGroup.big_family_id
        ? await fetchBigFamily(adminClient, smallGroup.big_family_id)
        : null;

      if (explicitBigFamilyId && explicitBigFamilyId !== (bigFamily?.id || 0)) {
        return null;
      }

      if (explicitDistrictId && explicitDistrictId !== smallGroup.district_id) {
        return null;
      }

      return {
        district_id: smallGroup.district_id,
        big_family_id: bigFamily?.id || null,
        small_group_id: smallGroup.id,
      };
    }

    if (!explicitDistrictId || !options.autoCreate || !options.fullName) {
      return null;
    }

    const district = await fetchDistrict(adminClient, explicitDistrictId);
    if (!district) {
      return null;
    }

    let bigFamilyId = null;
    if (explicitBigFamilyId) {
      const bigFamily = await fetchBigFamily(adminClient, explicitBigFamilyId);
      if (!bigFamily || bigFamily.district_id !== district.id) {
        return null;
      }
      bigFamilyId = bigFamily.id;
    }

    const { data: createdSmallGroup, error } = await adminClient
      .from("small_groups")
      .insert({
        district_id: district.id,
        big_family_id: bigFamilyId,
        name: `${options.fullName}小家`,
        description: "",
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      district_id: district.id,
      big_family_id: bigFamilyId,
      small_group_id: createdSmallGroup.id,
    };
  }

  if (["member", "best"].includes(role)) {
    if (!explicitSmallGroupId) {
      return null;
    }

    const smallGroup = await fetchSmallGroup(adminClient, explicitSmallGroupId);
    if (!smallGroup) {
      return null;
    }

    const bigFamily = smallGroup.big_family_id
      ? await fetchBigFamily(adminClient, smallGroup.big_family_id)
      : null;

    if (explicitBigFamilyId && explicitBigFamilyId !== (bigFamily?.id || 0)) {
      return null;
    }

    if (explicitDistrictId && explicitDistrictId !== smallGroup.district_id) {
      return null;
    }

    return {
      district_id: smallGroup.district_id,
      big_family_id: bigFamily?.id || null,
      small_group_id: smallGroup.id,
    };
  }

  return null;
}

function normalizeAttendanceStatus(value: unknown) {
  const normalized = String(value || "unknown");
  if (!VALID_ATTENDANCE_STATUS.has(normalized)) {
    return "unknown" as const;
  }

  return normalized as "unknown" | "present" | "absent";
}

function normalizeRole(value: unknown) {
  const normalized = String(value || "").trim();
  return [
    "district_leader",
    "big_family_leader",
    "small_group_leader",
    "member",
    "best",
  ].includes(normalized)
    ? normalized
    : "";
}

function normalizeGender(value: unknown) {
  const normalized = String(value || "").trim();
  return ["brother", "sister"].includes(normalized) ? normalized : null;
}

function toPositiveInt(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

function getMondayIso(source: Date | string) {
  const date =
    source instanceof Date ? new Date(source) : parseIsoDate(String(source));
  const day = date.getDay();
  const diff = -day;
  date.setDate(date.getDate() + diff);
  return formatDate(date);
}

function parseIsoDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map((value) => Number(value));
  return new Date(year, month - 1, day);
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
