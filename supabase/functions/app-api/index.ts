import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

declare const Deno: {
  serve: (
    handler: (request: Request) => Response | Promise<Response>,
  ) => void;
};

type AppSessionRow = {
  id: string;
  member_id: number;
  line_user_id: string;
  expires_at: string;
  revoked_at: string | null;
};

type WeeklyMemberNote = {
  note: string;
  carryForward: boolean;
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
};

type DistrictRow = {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
};

type BigFamilyRow = {
  id: number;
  district_id: number | null;
  name: string;
  description: string;
  is_active: boolean;
};

type SmallGroupRow = {
  id: number;
  district_id: number | null;
  big_family_id: number | null;
  name: string;
  description: string;
  is_active: boolean;
};

type OrganizationType = "district" | "big_family" | "small_group";

type ResolveMemberScopeOptions = {
  autoCreate: boolean;
  fullName: string;
  allowedArchivedIds?: {
    district_id: number | null;
    big_family_id: number | null;
    small_group_id: number | null;
  };
};

type OrganizationDeleteCheck = {
  big_family_count: number;
  small_group_count: number;
  member_count: number;
  can_delete: boolean;
  reasons: string[];
};

type ResolvedMemberScope = {
  district_id: number | null;
  big_family_id: number | null;
  small_group_id: number | null;
};

type AttendanceEventAnalytics = {
  present_count: number;
  absent_count: number;
  unknown_count: number;
  confirmed_count: number;
};

type AttendanceAnalyticsRange = {
  label: string;
  start_date: string;
  end_date: string;
  sunday_service: AttendanceEventAnalytics;
  small_group_fellowship: AttendanceEventAnalytics;
};

type DashboardAttendanceAnalytics = {
  recent_three_months: AttendanceAnalyticsRange;
  year_to_date: AttendanceAnalyticsRange;
};

const VALID_ATTENDANCE_STATUS = new Set(["unknown", "present", "absent"]);
const LOGIN_CAPABLE_ROLES = new Set([
  "district_leader",
  "big_family_leader",
  "small_group_leader",
]);
const ORG_LABELS: Record<OrganizationType, string> = {
  district: "區",
  big_family: "大家",
  small_group: "小家",
};

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

    if (request.method === "POST" && action === "archive-district") {
      return await handleArchiveOrganization(adminClient, request, "district");
    }

    if (request.method === "POST" && action === "restore-district") {
      return await handleRestoreOrganization(adminClient, request, "district");
    }

    if (request.method === "POST" && action === "delete-district") {
      return await handleDeleteOrganization(adminClient, request, "district");
    }

    if (request.method === "POST" && action === "archive-big-family") {
      return await handleArchiveOrganization(adminClient, request, "big_family");
    }

    if (request.method === "POST" && action === "restore-big-family") {
      return await handleRestoreOrganization(adminClient, request, "big_family");
    }

    if (request.method === "POST" && action === "delete-big-family") {
      return await handleDeleteOrganization(adminClient, request, "big_family");
    }

    if (request.method === "POST" && action === "archive-small-group") {
      return await handleArchiveOrganization(adminClient, request, "small_group");
    }

    if (request.method === "POST" && action === "restore-small-group") {
      return await handleRestoreOrganization(adminClient, request, "small_group");
    }

    if (request.method === "POST" && action === "delete-small-group") {
      return await handleDeleteOrganization(adminClient, request, "small_group");
    }

    if (request.method === "POST" && action === "create-member") {
      return await handleCreateMember(adminClient, request);
    }

    if (request.method === "POST" && action === "update-member") {
      return await handleUpdateMember(adminClient, request);
    }

    if (request.method === "POST" && action === "delete-member") {
      return await handleDeleteMember(adminClient, request);
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
  const noteMap = await loadWeeklyNoteMap(
    adminClient,
    week.id,
    rosterMembers,
  );
  const analytics = await loadAttendanceAnalytics(
    adminClient,
    rosterMembers.map((member) => member.id),
    weekStart,
  );

  const roster = rosterMembers.map((member) => ({
    ...member,
    note: noteMap.get(member.id)?.note ?? "",
    note_carry_forward: noteMap.get(member.id)?.carryForward ?? true,
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
    week: {
      ...week,
      label: buildWeekLabel(week.week_start_date),
    },
    analytics,
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
    .select("id, member_id, invite_code, expires_at, used_at, used_by_line_user_id, created_by_member_id, created_at")
    .eq("invite_code", inviteCode)
    .maybeSingle();

  if (inviteError) {
    return jsonResponse({ error: inviteError.message }, 500);
  }

  if (!invite) {
    return jsonResponse({ error: "找不到此邀請碼。" }, 404);
  }

  const inviteRow = invite as InviteRow;
  const { data: inviteMember, error: inviteMemberError } = await adminClient
    .from("members")
    .select("id, full_name, role, is_admin, is_active, line_user_id")
    .eq("id", inviteRow.member_id)
    .maybeSingle();

  if (inviteMemberError) {
    return jsonResponse({ error: inviteMemberError.message }, 500);
  }

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
  const visibleMembers = new Map<number, MemberDirectoryRow>(
    rosterMembers.map((member) => [member.id, member]),
  );
  const notesToUpdate: Array<{
    member_id: number;
    note: string;
    note_carry_forward: boolean;
  }> = [];

  const rowsToUpsert: Array<{
    member_id: number;
    attendance_week_id: number;
    event_type: "sunday_service" | "small_group_fellowship";
    status: "unknown" | "present" | "absent";
    note: string;
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
    const noteCarryForward = entry?.note_carry_forward !== false;
    const nowIso = new Date().toISOString();

    if (canEditNote(sessionContext.member, targetMember)) {
      notesToUpdate.push({
        member_id: memberId,
        note: noteCarryForward ? note : "",
        note_carry_forward: noteCarryForward,
      });
    }

    if (canEditAttendance(sessionContext.member, targetMember)) {
      rowsToUpsert.push(
        {
          member_id: memberId,
          attendance_week_id: week.id,
          event_type: "sunday_service",
          status: sundayStatus,
          note,
          recorded_by_member_id: sessionContext.member.id,
          recorded_at: nowIso,
        },
        {
          member_id: memberId,
          attendance_week_id: week.id,
          event_type: "small_group_fellowship",
          status: fellowshipStatus,
          note,
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
      .update({
        note: noteUpdate.note,
        note_carry_forward: noteUpdate.note_carry_forward,
      })
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

  if (!district.is_active) {
    return jsonResponse({ error: "此區已封存，請先恢復後再新增大家。" }, 409);
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

    if (!bigFamily.district_id) {
      return jsonResponse({ error: "Big family is missing district." }, 409);
    }

    const district = await fetchDistrict(adminClient, bigFamily.district_id);
    if (!district) {
      return jsonResponse({ error: "District not found." }, 404);
    }

    if (!district.is_active || !bigFamily.is_active) {
      return jsonResponse(
        { error: "所屬區或大家已封存，請先恢復後再新增小家。" },
        409,
      );
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

    if (!district.is_active) {
      return jsonResponse({ error: "此區已封存，請先恢復後再新增小家。" }, 409);
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
  const districtId = toPositiveInt(body?.district_id);
  const bigFamilyId = toPositiveInt(body?.big_family_id);
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

  let targetDistrictId = smallGroup.district_id;
  let targetBigFamilyId: number | null = body?.big_family_id === null ? null : smallGroup.big_family_id;

  if (bigFamilyId) {
    const bigFamily = await fetchBigFamily(adminClient, bigFamilyId);
    if (!bigFamily) {
      return jsonResponse({ error: "Big family not found." }, 404);
    }

    if (!bigFamily.district_id) {
      return jsonResponse({ error: "所屬大家尚未設定區，不能掛入小家。" }, 409);
    }

    if (!bigFamily.is_active) {
      return jsonResponse({ error: "已封存的大家不能作為小家歸屬。" }, 409);
    }

    targetDistrictId = bigFamily.district_id;
    targetBigFamilyId = bigFamily.id;
  } else if (districtId) {
    const district = await fetchDistrict(adminClient, districtId);
    if (!district) {
      return jsonResponse({ error: "District not found." }, 404);
    }

    if (!district.is_active) {
      return jsonResponse({ error: "已封存的區不能作為小家歸屬。" }, 409);
    }

    targetDistrictId = district.id;
    targetBigFamilyId = null;
  }

  if (!targetDistrictId || !canManageDistrict(sessionContext.member, targetDistrictId)) {
    return jsonResponse({ error: "No permission to move this small group." }, 403);
  }

  const { data, error } = await adminClient
    .from("small_groups")
    .update({
      district_id: targetDistrictId,
      big_family_id: targetBigFamilyId,
      name,
      description,
    })
    .eq("id", smallGroup.id)
    .select("*")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  const { error: memberScopeError } = await adminClient
    .from("members")
    .update({
      district_id: targetDistrictId,
      big_family_id: targetBigFamilyId,
    })
    .eq("small_group_id", smallGroup.id);

  if (memberScopeError) {
    return jsonResponse({ error: memberScopeError.message }, 500);
  }

  return jsonResponse({ small_group: data });
}

async function handleArchiveOrganization(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
  orgType: OrganizationType,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!sessionContext.member.is_admin) {
    return jsonResponse({ error: "Only admins can archive organizations." }, 403);
  }

  const orgId = await parseOrganizationActionBody(request, orgType);
  if (!orgId) {
    return jsonResponse(
      { error: `${getOrganizationIdKey(orgType)} is required.` },
      400,
    );
  }

  const organization = await fetchOrganizationByType(adminClient, orgType, orgId);
  if (!organization) {
    return jsonResponse({ error: `${ORG_LABELS[orgType]}不存在。` }, 404);
  }

  if (!organization.is_active) {
    return jsonResponse({
      status: "ok",
      message: `這個${ORG_LABELS[orgType]}已經是封存狀態。`,
    });
  }

  await updateOrganizationActiveState(adminClient, orgType, orgId, false);
  if (orgType === "district") {
    await cascadeArchiveDistrict(adminClient, orgId);
  } else if (orgType === "big_family") {
    await cascadeArchiveBigFamily(adminClient, orgId);
  }

  return jsonResponse({
    status: "ok",
    message:
      orgType === "district"
        ? "已封存區，底下大家與小家也已同步封存。"
        : orgType === "big_family"
          ? "已封存大家，底下小家也已同步封存。"
          : "已封存小家。",
  });
}

async function handleRestoreOrganization(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
  orgType: OrganizationType,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!sessionContext.member.is_admin) {
    return jsonResponse({ error: "Only admins can restore organizations." }, 403);
  }

  const orgId = await parseOrganizationActionBody(request, orgType);
  if (!orgId) {
    return jsonResponse(
      { error: `${getOrganizationIdKey(orgType)} is required.` },
      400,
    );
  }

  const organization = await fetchOrganizationByType(adminClient, orgType, orgId);
  if (!organization) {
    return jsonResponse({ error: `${ORG_LABELS[orgType]}不存在。` }, 404);
  }

  if (organization.is_active) {
    return jsonResponse({
      status: "ok",
      message: `這個${ORG_LABELS[orgType]}已經是啟用狀態。`,
    });
  }

  if (orgType === "big_family") {
    const bigFamily = organization as BigFamilyRow;
    if (!bigFamily.district_id) {
      return jsonResponse({ error: "此大家缺少所屬區，無法恢復。" }, 409);
    }

    const district = await fetchDistrict(adminClient, bigFamily.district_id);
    if (!district || !district.is_active) {
      return jsonResponse(
        { error: "上層區仍是封存狀態，請先恢復區後再恢復大家。" },
        409,
      );
    }
  }

  if (orgType === "small_group") {
    const smallGroup = organization as SmallGroupRow;
    if (!smallGroup.district_id) {
      return jsonResponse({ error: "此小家缺少所屬區，無法恢復。" }, 409);
    }

    const district = await fetchDistrict(adminClient, smallGroup.district_id);
    if (!district || !district.is_active) {
      return jsonResponse(
        { error: "上層區仍是封存狀態，請先恢復區後再恢復小家。" },
        409,
      );
    }

    if (smallGroup.big_family_id) {
      const bigFamily = await fetchBigFamily(adminClient, smallGroup.big_family_id);
      if (!bigFamily || !bigFamily.is_active) {
        return jsonResponse(
          { error: "所屬大家仍是封存狀態，請先恢復大家後再恢復小家。" },
          409,
        );
      }
    }
  }

  await updateOrganizationActiveState(adminClient, orgType, orgId, true);

  return jsonResponse({
    status: "ok",
    message: `已恢復${ORG_LABELS[orgType]}。`,
  });
}

async function handleDeleteOrganization(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
  orgType: OrganizationType,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!sessionContext.member.is_admin) {
    return jsonResponse({ error: "Only admins can delete organizations." }, 403);
  }

  const orgId = await parseOrganizationActionBody(request, orgType);
  if (!orgId) {
    return jsonResponse(
      { error: `${getOrganizationIdKey(orgType)} is required.` },
      400,
    );
  }

  const organization = await fetchOrganizationByType(adminClient, orgType, orgId);
  if (!organization) {
    return jsonResponse({ error: `${ORG_LABELS[orgType]}不存在。` }, 404);
  }

  const deleteCheck = await buildOrganizationDeleteCheck(adminClient, orgType, orgId);
  if (!deleteCheck.can_delete) {
    return jsonResponse(
      { error: formatOrganizationDeleteMessage(orgType, deleteCheck) },
      409,
    );
  }

  const { error } = await adminClient
    .from(getOrganizationTableName(orgType))
    .delete()
    .eq("id", orgId);
  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({
    status: "ok",
    message: `已刪除${ORG_LABELS[orgType]}。`,
  });
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

  let scope: ResolvedMemberScope | null = null;
  try {
    scope = await resolveMemberScope(adminClient, body, role, {
      autoCreate: true,
      fullName,
    });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Invalid hierarchy scope for this role." },
      400,
    );
  }
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

  let scope: ResolvedMemberScope | null = null;
  try {
    scope = await resolveMemberScope(adminClient, body, targetRole, {
      autoCreate: false,
      fullName: String(body?.full_name || targetMember.full_name).trim(),
      allowedArchivedIds: {
        district_id: targetMember.district_id,
        big_family_id: targetMember.big_family_id,
        small_group_id: targetMember.small_group_id,
      },
    });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Invalid hierarchy scope for this role." },
      400,
    );
  }
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

  if (targetRole === "small_group_leader" && scope.small_group_id && scope.district_id) {
    const { error: smallGroupUpdateError } = await adminClient
      .from("small_groups")
      .update({
        district_id: scope.district_id,
        big_family_id: scope.big_family_id,
      })
      .eq("id", scope.small_group_id);

    if (smallGroupUpdateError) {
      return jsonResponse({ error: smallGroupUpdateError.message }, 500);
    }

    const { error: peerMemberUpdateError } = await adminClient
      .from("members")
      .update({
        district_id: scope.district_id,
        big_family_id: scope.big_family_id,
      })
      .eq("small_group_id", scope.small_group_id);

    if (peerMemberUpdateError) {
      return jsonResponse({ error: peerMemberUpdateError.message }, 500);
    }
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

async function handleDeleteMember(
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

  if (memberId === sessionContext.member.id) {
    return jsonResponse({ error: "不能刪除目前登入中的自己。" }, 409);
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

  if (!canDeleteMember(sessionContext.member, targetMember)) {
    return jsonResponse({ error: "No permission to delete this member." }, 403);
  }

  const { error: deleteError } = await adminClient
    .from("members")
    .delete()
    .eq("id", targetMember.id);

  if (deleteError) {
    return jsonResponse({ error: deleteError.message }, 500);
  }

  return jsonResponse({
    status: "ok",
    message: `已刪除 ${targetMember.full_name}。`,
  });
}

async function handleCreateInvite(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!sessionContext.member.is_admin) {
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
): Promise<MemberDirectoryRow[]> {
  let query = adminClient
    .from("member_directory")
    .select("*")
    .eq("is_active", true);

  if (viewer.is_admin) {
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    return ((data || []) as MemberDirectoryRow[]).filter((member) => member.id !== viewer.id);
  }

  if (viewer.role === "district_leader") {
    if (!viewer.district_id) {
      return [];
    }

    query = query
      .eq("district_id", viewer.district_id)
      .in("role", ["big_family_leader", "small_group_leader", "member", "best"]);
  } else if (viewer.role === "big_family_leader") {
    if (!viewer.big_family_id) {
      return [];
    }

    query = query
      .eq("big_family_id", viewer.big_family_id)
      .in("role", ["small_group_leader", "member", "best"]);
  } else if (viewer.role === "small_group_leader") {
    if (!viewer.small_group_id) {
      return [];
    }

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

  return ((data || []) as MemberDirectoryRow[]).filter((member) => member.id !== viewer.id);
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

async function loadWeeklyNoteMap(
  adminClient: ReturnType<typeof createAdminClient>,
  attendanceWeekId: number,
  members: MemberDirectoryRow[],
) {
  const map = new Map<number, WeeklyMemberNote>();
  if (!members.length) {
    return map;
  }

  const memberIds = members.map((member) => member.id);
  const { data, error } = await adminClient
    .from("attendance_records")
    .select("member_id, note")
    .eq("attendance_week_id", attendanceWeekId)
    .in("member_id", memberIds);

  if (error) {
    throw new Error(error.message);
  }

  for (const row of data || []) {
    const note = String(row.note || "").trim();
    const memberId = Number(row.member_id);
    if (note || !map.has(memberId)) {
      map.set(memberId, {
        note,
        carryForward: members.find((member) => member.id === memberId)
          ?.note_carry_forward !== false,
      });
    }
  }

  for (const member of members) {
    if (map.has(member.id)) {
      continue;
    }

    map.set(member.id, {
      note: member.note_carry_forward ? member.note || "" : "",
      carryForward: member.note_carry_forward !== false,
    });
  }

  return map;
}

function createEmptyAttendanceEventAnalytics(): AttendanceEventAnalytics {
  return {
    present_count: 0,
    absent_count: 0,
    unknown_count: 0,
    confirmed_count: 0,
  };
}

function createAttendanceAnalyticsRange(
  label: string,
  startDate: string,
  endDate: string,
): AttendanceAnalyticsRange {
  return {
    label,
    start_date: startDate,
    end_date: endDate,
    sunday_service: createEmptyAttendanceEventAnalytics(),
    small_group_fellowship: createEmptyAttendanceEventAnalytics(),
  };
}

function createEmptyDashboardAttendanceAnalytics(
  anchorWeekStart: string,
): DashboardAttendanceAnalytics {
  const recentThreeMonthsStart = shiftIsoDateByDays(anchorWeekStart, -89);
  const yearStart = `${parseIsoDate(anchorWeekStart).getFullYear()}-01-01`;

  return {
    recent_three_months: createAttendanceAnalyticsRange(
      "近三個月",
      recentThreeMonthsStart,
      anchorWeekStart,
    ),
    year_to_date: createAttendanceAnalyticsRange("今年", yearStart, anchorWeekStart),
  };
}

function accumulateAttendanceAnalytics(
  stats: AttendanceEventAnalytics,
  status: string,
) {
  if (status === "present") {
    stats.present_count += 1;
    stats.confirmed_count += 1;
    return;
  }

  if (status === "absent") {
    stats.absent_count += 1;
    stats.confirmed_count += 1;
    return;
  }

  stats.unknown_count += 1;
}

async function loadAttendanceAnalytics(
  adminClient: ReturnType<typeof createAdminClient>,
  memberIds: number[],
  anchorWeekStart: string,
): Promise<DashboardAttendanceAnalytics> {
  const analytics = createEmptyDashboardAttendanceAnalytics(anchorWeekStart);
  if (!memberIds.length) {
    return analytics;
  }

  const earliestStartDate = analytics.year_to_date.start_date <= analytics.recent_three_months.start_date
    ? analytics.year_to_date.start_date
    : analytics.recent_three_months.start_date;

  const { data: weeks, error: weeksError } = await adminClient
    .from("attendance_weeks")
    .select("id, week_start_date")
    .gte("week_start_date", earliestStartDate)
    .lte("week_start_date", anchorWeekStart)
    .order("week_start_date");

  if (weeksError) {
    throw new Error(weeksError.message);
  }

  const weekRows = weeks || [];
  if (!weekRows.length) {
    return analytics;
  }

  const weekDateMap = new Map<number, string>(
    weekRows.map((week) => [week.id as number, week.week_start_date as string]),
  );

  const { data: records, error: recordsError } = await adminClient
    .from("attendance_records")
    .select("attendance_week_id, event_type, status")
    .in("attendance_week_id", Array.from(weekDateMap.keys()))
    .in("member_id", memberIds);

  if (recordsError) {
    throw new Error(recordsError.message);
  }

  for (const record of records || []) {
    const weekDate = weekDateMap.get(record.attendance_week_id as number);
    if (!weekDate) {
      continue;
    }

    const targetKey =
      record.event_type === "small_group_fellowship"
        ? "small_group_fellowship"
        : "sunday_service";

    if (
      weekDate >= analytics.recent_three_months.start_date &&
      weekDate <= analytics.recent_three_months.end_date
    ) {
      accumulateAttendanceAnalytics(
        analytics.recent_three_months[targetKey],
        String(record.status || "unknown"),
      );
    }

    if (
      weekDate >= analytics.year_to_date.start_date &&
      weekDate <= analytics.year_to_date.end_date
    ) {
      accumulateAttendanceAnalytics(
        analytics.year_to_date[targetKey],
        String(record.status || "unknown"),
      );
    }
  }

  return analytics;
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
      Boolean(viewer.district_id) &&
      viewer.district_id === target.district_id &&
      ["big_family_leader", "small_group_leader", "member", "best"].includes(
        target.role,
      )
    );
  }

  if (viewer.role === "big_family_leader") {
    return (
      Boolean(viewer.big_family_id) &&
      viewer.big_family_id === target.big_family_id &&
      ["small_group_leader", "member", "best"].includes(target.role)
    );
  }

  if (viewer.role === "small_group_leader") {
    return (
      Boolean(viewer.small_group_id) &&
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
    return Boolean(viewer.district_id) && viewer.district_id === target.district_id;
  }

  if (viewer.role === "big_family_leader") {
    return Boolean(viewer.big_family_id) && viewer.big_family_id === target.big_family_id;
  }

  if (viewer.role === "small_group_leader") {
    return Boolean(viewer.small_group_id) && viewer.small_group_id === target.small_group_id;
  }

  return false;
}

function canUseAdminPanel(viewer: MemberDirectoryRow) {
  return viewer.is_admin || viewer.role === "district_leader";
}

function canManageDistrict(viewer: MemberDirectoryRow, districtId: number | null) {
  return viewer.is_admin || (districtId !== null && viewer.district_id === districtId);
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
  return viewer.is_admin && isLoginEnabledMember(target);
}

function canEditProfile(viewer: MemberDirectoryRow, target: MemberDirectoryRow) {
  if (viewer.is_admin) {
    return true;
  }

  return (
    viewer.role === "district_leader" &&
    Boolean(viewer.district_id) &&
    target.district_id === viewer.district_id &&
    ["member", "best"].includes(target.role)
  );
}

function canDeleteMember(viewer: MemberDirectoryRow, target: MemberDirectoryRow) {
  if (target.id === viewer.id) {
    return false;
  }

  if (viewer.is_admin) {
    return true;
  }

  return (
    viewer.role === "district_leader" &&
    Boolean(viewer.district_id) &&
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
  const scopedDistrictIds = districtIds.length ? districtIds : [-1];

  let bigFamilyQuery = adminClient
    .from("big_families")
    .select("id, district_id, name, description, is_active")
    .order("is_active", { ascending: false })
    .order("name");
  if (!viewer.is_admin) {
    bigFamilyQuery = bigFamilyQuery.in("district_id", scopedDistrictIds);
  }

  const { data: bigFamilies, error: bigFamilyError } = await bigFamilyQuery;

  if (bigFamilyError) {
    throw new Error(bigFamilyError.message);
  }

  const bigFamilyMap = new Map<number, BigFamilyRow>(
    (bigFamilies || []).map((item) => [item.id, item as BigFamilyRow]),
  );

  let smallGroupQuery = adminClient
    .from("small_groups")
    .select("id, district_id, big_family_id, name, description, is_active")
    .order("is_active", { ascending: false })
    .order("name");
  if (!viewer.is_admin) {
    smallGroupQuery = smallGroupQuery.in("district_id", scopedDistrictIds);
  }

  const { data: smallGroups, error: smallGroupError } = await smallGroupQuery;

  if (smallGroupError) {
    throw new Error(smallGroupError.message);
  }

  let memberQuery = adminClient
    .from("member_directory")
    .select("*")
    .order("full_name");
  if (!viewer.is_admin) {
    memberQuery = memberQuery.in("district_id", scopedDistrictIds);
  }

  const { data: members, error: memberError } = await memberQuery;

  if (memberError) {
    throw new Error(memberError.message);
  }

  const memberMap = new Map<number, MemberDirectoryRow>(
    (members || []).map((member) => [member.id, member as MemberDirectoryRow]),
  );
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

  const creatorMap = new Map<number, string>(
    (creatorMembers || []).map((creator) => [creator.id, creator.full_name]),
  );

  const invites = viewer.is_admin
    ? (inviteRows || [])
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
        .filter(Boolean)
    : [];

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
): Promise<DistrictRow[]> {
  const query = adminClient
    .from("districts")
    .select("*")
    .order("is_active", { ascending: false })
    .order("name");
  if (viewer.is_admin) {
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as DistrictRow[];
  }

  if (!viewer.district_id) {
    return [];
  }

  const { data, error } = await adminClient
    .from("districts")
    .select("*")
    .eq("id", viewer.district_id)
    .order("is_active", { ascending: false })
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as DistrictRow[];
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

function getOrganizationIdKey(orgType: OrganizationType) {
  if (orgType === "district") {
    return "district_id";
  }

  if (orgType === "big_family") {
    return "big_family_id";
  }

  return "small_group_id";
}

function getOrganizationTableName(orgType: OrganizationType) {
  if (orgType === "district") {
    return "districts";
  }

  if (orgType === "big_family") {
    return "big_families";
  }

  return "small_groups";
}

async function parseOrganizationActionBody(request: Request, orgType: OrganizationType) {
  const body = await request.json().catch(() => null);
  return toPositiveInt(body?.[getOrganizationIdKey(orgType)]);
}

async function fetchOrganizationByType(
  adminClient: ReturnType<typeof createAdminClient>,
  orgType: OrganizationType,
  orgId: number,
) {
  if (orgType === "district") {
    return await fetchDistrict(adminClient, orgId);
  }

  if (orgType === "big_family") {
    return await fetchBigFamily(adminClient, orgId);
  }

  return await fetchSmallGroup(adminClient, orgId);
}

async function updateOrganizationActiveState(
  adminClient: ReturnType<typeof createAdminClient>,
  orgType: OrganizationType,
  orgId: number,
  isActive: boolean,
) {
  const { error } = await adminClient
    .from(getOrganizationTableName(orgType))
    .update({ is_active: isActive })
    .eq("id", orgId);

  if (error) {
    throw new Error(error.message);
  }
}

async function cascadeArchiveDistrict(
  adminClient: ReturnType<typeof createAdminClient>,
  districtId: number,
) {
  const { error: bigFamilyError } = await adminClient
    .from("big_families")
    .update({ is_active: false })
    .eq("district_id", districtId);
  if (bigFamilyError) {
    throw new Error(bigFamilyError.message);
  }

  const { error: smallGroupError } = await adminClient
    .from("small_groups")
    .update({ is_active: false })
    .eq("district_id", districtId);
  if (smallGroupError) {
    throw new Error(smallGroupError.message);
  }
}

async function cascadeArchiveBigFamily(
  adminClient: ReturnType<typeof createAdminClient>,
  bigFamilyId: number,
) {
  const { error } = await adminClient
    .from("small_groups")
    .update({ is_active: false })
    .eq("big_family_id", bigFamilyId);
  if (error) {
    throw new Error(error.message);
  }
}

async function countRows(queryPromise: PromiseLike<any>) {
  const { count, error } = await queryPromise;
  if (error) {
    throw new Error(error.message);
  }

  return count || 0;
}

async function buildOrganizationDeleteCheck(
  adminClient: ReturnType<typeof createAdminClient>,
  orgType: OrganizationType,
  orgId: number,
): Promise<OrganizationDeleteCheck> {
  if (orgType === "district") {
    const [bigFamilyCount, smallGroupCount, memberCount] = await Promise.all([
      countRows(
        adminClient
          .from("big_families")
          .select("id", { head: true, count: "exact" })
          .eq("district_id", orgId),
      ),
      countRows(
        adminClient
          .from("small_groups")
          .select("id", { head: true, count: "exact" })
          .eq("district_id", orgId),
      ),
      countRows(
        adminClient
          .from("member_directory")
          .select("id", { head: true, count: "exact" })
          .eq("district_id", orgId),
      ),
    ]);

    const reasons = [
      bigFamilyCount ? `${bigFamilyCount} 個大家` : "",
      smallGroupCount ? `${smallGroupCount} 個小家` : "",
      memberCount ? `${memberCount} 位成員` : "",
    ].filter(Boolean);

    return {
      big_family_count: bigFamilyCount,
      small_group_count: smallGroupCount,
      member_count: memberCount,
      can_delete: reasons.length === 0,
      reasons,
    };
  }

  if (orgType === "big_family") {
    const [smallGroupCount, memberCount] = await Promise.all([
      countRows(
        adminClient
          .from("small_groups")
          .select("id", { head: true, count: "exact" })
          .eq("big_family_id", orgId),
      ),
      countRows(
        adminClient
          .from("member_directory")
          .select("id", { head: true, count: "exact" })
          .eq("big_family_id", orgId),
      ),
    ]);

    const reasons = [
      smallGroupCount ? `${smallGroupCount} 個小家` : "",
      memberCount ? `${memberCount} 位成員` : "",
    ].filter(Boolean);

    return {
      big_family_count: 0,
      small_group_count: smallGroupCount,
      member_count: memberCount,
      can_delete: reasons.length === 0,
      reasons,
    };
  }

  const memberCount = await countRows(
    adminClient
      .from("member_directory")
      .select("id", { head: true, count: "exact" })
      .eq("small_group_id", orgId),
  );
  const reasons = [memberCount ? `${memberCount} 位成員` : ""].filter(Boolean);

  return {
    big_family_count: 0,
    small_group_count: 0,
    member_count: memberCount,
    can_delete: reasons.length === 0,
    reasons,
  };
}

function formatOrganizationDeleteMessage(
  orgType: OrganizationType,
  deleteCheck: OrganizationDeleteCheck,
) {
  return `${ORG_LABELS[orgType]}尚未清空，仍有${deleteCheck.reasons.join("、")}，請先整理後再刪除。`;
}

function isAllowedArchivedSelection(
  orgType: OrganizationType,
  orgId: number,
  options: ResolveMemberScopeOptions,
) {
  const allowedArchivedIds = options.allowedArchivedIds;
  if (!allowedArchivedIds) {
    return false;
  }

  if (orgType === "district") {
    return allowedArchivedIds.district_id === orgId;
  }

  if (orgType === "big_family") {
    return allowedArchivedIds.big_family_id === orgId;
  }

  return allowedArchivedIds.small_group_id === orgId;
}

function assertOrganizationSelectable(
  orgType: OrganizationType,
  organization: { id: number; is_active: boolean },
  options: ResolveMemberScopeOptions,
  archivedMessage: string,
) {
  if (!organization.is_active && !isAllowedArchivedSelection(orgType, organization.id, options)) {
    throw new Error(archivedMessage);
  }
}

async function resolveMemberScope(
  adminClient: ReturnType<typeof createAdminClient>,
  body: any,
  role: string,
  options: ResolveMemberScopeOptions,
): Promise<ResolvedMemberScope | null> {
  const explicitDistrictId = toPositiveInt(body?.district_id);
  const explicitBigFamilyId = toPositiveInt(body?.big_family_id);
  const explicitSmallGroupId = toPositiveInt(body?.small_group_id);

  if (role === "district_leader") {
    if (explicitDistrictId) {
      const district = await fetchDistrict(adminClient, explicitDistrictId);
      if (!district) {
        return null;
      }

      assertOrganizationSelectable(
        "district",
        district,
        options,
        "已封存的區不能作為新資料歸屬。",
      );

      return {
        district_id: district.id,
        big_family_id: null,
        small_group_id: null,
      };
    }

    if (!options.autoCreate) {
      return {
        district_id: null,
        big_family_id: null,
        small_group_id: null,
      };
    }

    if (!options.fullName) {
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
      if (!bigFamily || !bigFamily.district_id) {
        return null;
      }

      const district = await fetchDistrict(adminClient, bigFamily.district_id);
      if (!district) {
        return null;
      }

      if (explicitDistrictId && explicitDistrictId !== bigFamily.district_id) {
        return null;
      }

      assertOrganizationSelectable(
        "district",
        district,
        options,
        "已封存的區不能作為新資料歸屬。",
      );
      assertOrganizationSelectable(
        "big_family",
        bigFamily,
        options,
        "已封存的大家不能作為新資料歸屬。",
      );

      return {
        district_id: bigFamily.district_id,
        big_family_id: bigFamily.id,
        small_group_id: null,
      };
    }

    if (!explicitDistrictId) {
      if (options.autoCreate) {
        return null;
      }

      return {
        district_id: null,
        big_family_id: null,
        small_group_id: null,
      };
    }

    const district = await fetchDistrict(adminClient, explicitDistrictId);
    if (!district) {
      return null;
    }

    assertOrganizationSelectable(
      "district",
      district,
      options,
      "已封存的區不能作為新資料歸屬。",
    );

    if (!options.autoCreate) {
      return {
        district_id: district.id,
        big_family_id: null,
        small_group_id: null,
      };
    }

    if (!options.fullName) {
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

      if (!smallGroup.district_id) {
        return null;
      }

      const district = await fetchDistrict(adminClient, smallGroup.district_id);
      if (!district) {
        return null;
      }

      const bigFamily = smallGroup.big_family_id
        ? await fetchBigFamily(adminClient, smallGroup.big_family_id)
        : null;
      if (smallGroup.big_family_id && !bigFamily) {
        return null;
      }

      if (explicitBigFamilyId && explicitBigFamilyId !== (bigFamily?.id || 0)) {
        return null;
      }

      if (explicitDistrictId && explicitDistrictId !== smallGroup.district_id) {
        return null;
      }

      assertOrganizationSelectable(
        "district",
        district,
        options,
        "已封存的區不能作為新資料歸屬。",
      );
      if (bigFamily) {
        assertOrganizationSelectable(
          "big_family",
          bigFamily,
          options,
          "已封存的大家不能作為新資料歸屬。",
        );
      }
      assertOrganizationSelectable(
        "small_group",
        smallGroup,
        options,
        "已封存的小家不能作為新資料歸屬。",
      );

      return {
        district_id: smallGroup.district_id,
        big_family_id: explicitBigFamilyId || null,
        small_group_id: smallGroup.id,
      };
    }

    if (explicitBigFamilyId) {
      const bigFamily = await fetchBigFamily(adminClient, explicitBigFamilyId);
      if (!bigFamily || !bigFamily.district_id) {
        return null;
      }

      assertOrganizationSelectable(
        "big_family",
        bigFamily,
        options,
        "已封存的大家不能作為新資料歸屬。",
      );

      if (explicitDistrictId && explicitDistrictId !== bigFamily.district_id) {
        return null;
      }

      if (!options.autoCreate) {
        return {
          district_id: bigFamily.district_id,
          big_family_id: bigFamily.id,
          small_group_id: null,
        };
      }
    }

    if (!explicitDistrictId) {
      if (options.autoCreate) {
        return null;
      }

      return {
        district_id: null,
        big_family_id: null,
        small_group_id: null,
      };
    }

    const district = await fetchDistrict(adminClient, explicitDistrictId);
    if (!district) {
      return null;
    }

    assertOrganizationSelectable(
      "district",
      district,
      options,
      "已封存的區不能作為新資料歸屬。",
    );

    let bigFamilyId: number | null = null;
    if (explicitBigFamilyId) {
      const bigFamily = await fetchBigFamily(adminClient, explicitBigFamilyId);
      if (!bigFamily || bigFamily.district_id !== district.id) {
        return null;
      }

      assertOrganizationSelectable(
        "big_family",
        bigFamily,
        options,
        "已封存的大家不能作為新資料歸屬。",
      );
      bigFamilyId = bigFamily.id;
    }

    if (!options.autoCreate) {
      return {
        district_id: district.id,
        big_family_id: bigFamilyId,
        small_group_id: null,
      };
    }

    if (!options.fullName) {
      return null;
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
    if (explicitSmallGroupId) {
      const smallGroup = await fetchSmallGroup(adminClient, explicitSmallGroupId);
      if (!smallGroup || !smallGroup.district_id) {
        return null;
      }

      const district = await fetchDistrict(adminClient, smallGroup.district_id);
      if (!district) {
        return null;
      }

      const bigFamily = smallGroup.big_family_id
        ? await fetchBigFamily(adminClient, smallGroup.big_family_id)
        : null;
      if (smallGroup.big_family_id && !bigFamily) {
        return null;
      }

      if (explicitBigFamilyId && explicitBigFamilyId !== (bigFamily?.id || 0)) {
        return null;
      }

      if (explicitDistrictId && explicitDistrictId !== smallGroup.district_id) {
        return null;
      }

      assertOrganizationSelectable(
        "district",
        district,
        options,
        "已封存的區不能作為新資料歸屬。",
      );
      if (bigFamily) {
        assertOrganizationSelectable(
          "big_family",
          bigFamily,
          options,
          "已封存的大家不能作為新資料歸屬。",
        );
      }
      assertOrganizationSelectable(
        "small_group",
        smallGroup,
        options,
        "已封存的小家不能作為新資料歸屬。",
      );

      return {
        district_id: smallGroup.district_id,
        big_family_id: explicitBigFamilyId || null,
        small_group_id: smallGroup.id,
      };
    }

    if (explicitBigFamilyId) {
      const bigFamily = await fetchBigFamily(adminClient, explicitBigFamilyId);
      if (!bigFamily || !bigFamily.district_id) {
        return null;
      }

      if (explicitDistrictId && explicitDistrictId !== bigFamily.district_id) {
        return null;
      }

      assertOrganizationSelectable(
        "big_family",
        bigFamily,
        options,
        "已封存的大家不能作為新資料歸屬。",
      );

      return {
        district_id: bigFamily.district_id,
        big_family_id: bigFamily.id,
        small_group_id: null,
      };
    }

    if (explicitDistrictId) {
      const district = await fetchDistrict(adminClient, explicitDistrictId);
      if (!district) {
        return null;
      }

      assertOrganizationSelectable(
        "district",
        district,
        options,
        "已封存的區不能作為新資料歸屬。",
      );

      return {
        district_id: district.id,
        big_family_id: null,
        small_group_id: null,
      };
    }

    return {
      district_id: null,
      big_family_id: null,
      small_group_id: null,
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

function shiftIsoDateByDays(isoDate: string, dayOffset: number) {
  const date = parseIsoDate(isoDate);
  date.setDate(date.getDate() + dayOffset);
  return formatDate(date);
}
