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
  priorityHigh: boolean;
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
  "preacher",
  "trainee_preacher",
  "district_pastor",
  "district_leader",
  "big_family_leader",
  "trainee_big_family_leader",
  "small_group_leader",
  "trainee_small_group_leader",
]);
const PREACHER_ROLES = new Set(["preacher", "trainee_preacher"]);
const DISTRICT_PASTOR_ROLES = new Set(["district_pastor"]);
const DISTRICT_LEADER_ROLES = new Set(["district_leader"]);
const BIG_FAMILY_LEADER_ROLES = new Set(["big_family_leader", "trainee_big_family_leader"]);
const SMALL_GROUP_LEADER_ROLES = new Set([
  "small_group_leader",
  "trainee_small_group_leader",
]);
const MEMBER_ROLES = new Set(["member", "best"]);
const OVERVIEW_ROLES = new Set([
  "preacher",
  "trainee_preacher",
  "district_pastor",
  "district_leader",
  "big_family_leader",
  "trainee_big_family_leader",
]);
const ORG_LABELS: Record<OrganizationType, string> = {
  district: "區",
  big_family: "大家",
  small_group: "小家",
};
const NOTE_MAX_LENGTH = 1000;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;
const CLEANUP_ACTIONS = new Set(["bind", "logout"]);

let lastCleanupAt = 0;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const adminClient = createAdminClient();
    const url = new URL(request.url);
    const action = url.searchParams.get("action") || "";
    await cleanupExpiredAuthArtifactsIfDue(adminClient, action);

    if (request.method === "GET" && action === "session") {
      return await handleGetSession(adminClient, request.headers);
    }

    if (request.method === "GET" && action === "dashboard") {
      return await handleGetDashboard(adminClient, request.headers, url);
    }

    if (request.method === "GET" && action === "admin-overview") {
      return await handleGetAdminOverview(adminClient, request.headers);
    }

    if (request.method === "GET" && action === "attendance-overview") {
      return await handleGetAttendanceOverview(adminClient, request.headers, url);
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

    if (request.method === "POST" && action === "move-organization") {
      return await handleMoveOrganization(adminClient, request);
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

    if (request.method === "POST" && action === "purge-member") {
      return await handlePurgeMember(adminClient, request);
    }

    if (request.method === "POST" && action === "create-invite") {
      return await handleCreateInvite(adminClient, request);
    }

    if (request.method === "POST" && action === "delete-invite") {
      return await handleDeleteInvite(adminClient, request);
    }

    if (request.method === "POST" && action === "reset-member-line-binding") {
      return await handleResetMemberLineBinding(adminClient, request);
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

async function cleanupExpiredAuthArtifactsIfDue(
  adminClient: ReturnType<typeof createAdminClient>,
  action: string,
) {
  const now = Date.now();
  if (!CLEANUP_ACTIONS.has(action) && now - lastCleanupAt < CLEANUP_INTERVAL_MS) {
    return;
  }

  await cleanupExpiredAuthArtifacts(adminClient);
  lastCleanupAt = now;
}

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
  const { attendanceMap, noteMap } = await loadWeeklyAttendanceState(
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
    note_priority_high: noteMap.get(member.id)?.priorityHigh ?? false,
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

async function handleGetAttendanceOverview(
  adminClient: ReturnType<typeof createAdminClient>,
  headers: Headers,
  url: URL,
) {
  const sessionContext = await getSessionContext(adminClient, headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!canUseAttendanceOverview(sessionContext.member)) {
    return jsonResponse({ error: "Forbidden." }, 403);
  }

  const requestedWeek = url.searchParams.get("week_start");
  const weekStart = requestedWeek
    ? getMondayIso(requestedWeek)
    : getMondayIso(new Date());
  const overview = await buildAttendanceOverview(
    adminClient,
    sessionContext.member,
    weekStart,
  );
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

  const nowIso = new Date().toISOString();

  if (inviteRow.used_at) {
    if (
      inviteRow.used_by_line_user_id === pendingContext.pending.line_user_id &&
      inviteMember.line_user_id === pendingContext.pending.line_user_id
    ) {
      return await issueSessionForInviteMember(
        adminClient,
        inviteRow.member_id,
        pendingContext.pending.line_user_id,
        pendingContext.pending.id,
        nowIso,
      );
    }

    return jsonResponse({ error: "此邀請碼已被使用。" }, 409);
  }

  if (new Date(inviteRow.expires_at).getTime() < Date.now()) {
    return jsonResponse({ error: "此邀請碼已過期。" }, 410);
  }

  const { data: existingByLineUserId, error: existingByLineUserIdError } =
    await adminClient
      .from("members")
      .select("id, role, is_admin, is_active")
      .eq("line_user_id", pendingContext.pending.line_user_id)
      .maybeSingle();

  if (existingByLineUserIdError) {
    return jsonResponse({ error: existingByLineUserIdError.message }, 500);
  }

  if (existingByLineUserId && existingByLineUserId.id !== inviteRow.member_id) {
    if (isLoginEnabledMember(existingByLineUserId)) {
      return jsonResponse({ error: "此 LINE 帳號已綁定其他可登入人員。" }, 409);
    }

    const { error: clearOldBindingError } = await adminClient
      .from("members")
      .update({ line_user_id: null, last_line_login_at: null })
      .eq("id", existingByLineUserId.id);
    if (clearOldBindingError) {
      return jsonResponse({ error: clearOldBindingError.message }, 500);
    }

    const { error: revokeOldSessionsError } = await adminClient
      .from("app_sessions")
      .update({ revoked_at: nowIso })
      .eq("line_user_id", pendingContext.pending.line_user_id)
      .is("revoked_at", null);
    if (revokeOldSessionsError) {
      return jsonResponse({ error: revokeOldSessionsError.message }, 500);
    }
  }

  if (
    inviteMember.line_user_id &&
    inviteMember.line_user_id !== pendingContext.pending.line_user_id
  ) {
    return jsonResponse({ error: "此人員已綁定其他 LINE 帳號。" }, 409);
  }

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

async function issueSessionForInviteMember(
  adminClient: ReturnType<typeof createAdminClient>,
  memberId: number,
  lineUserId: string,
  pendingId: string,
  nowIso: string,
) {
  const { error: memberUpdateError } = await adminClient
    .from("members")
    .update({ last_line_login_at: nowIso })
    .eq("id", memberId);

  if (memberUpdateError) {
    return jsonResponse({ error: memberUpdateError.message }, 500);
  }

  const { data: memberDirectory, error: memberDirectoryError } = await adminClient
    .from("member_directory")
    .select("*")
    .eq("id", memberId)
    .single();

  if (memberDirectoryError) {
    return jsonResponse({ error: memberDirectoryError.message }, 500);
  }

  const { error: consumePendingError } = await adminClient
    .from("line_pending_logins")
    .update({ consumed_at: nowIso })
    .eq("id", pendingId);

  if (consumePendingError) {
    return jsonResponse({ error: consumePendingError.message }, 500);
  }

  const session = await issueAppSession(adminClient, {
    id: memberId,
    line_user_id: lineUserId,
  });

  return jsonResponse({
    status: "authenticated",
    app_token: session.appToken,
    current_member: memberDirectory,
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
    note_priority_high: boolean;
  }> = [];

  const rowsToUpsert: Array<{
    member_id: number;
    attendance_week_id: number;
    event_type: "sunday_service" | "small_group_fellowship";
    status: "unknown" | "present" | "absent";
    note: string;
    note_priority_high: boolean;
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
    const notePriorityHigh = Boolean(note && entry?.note_priority_high);
    const nowIso = new Date().toISOString();

    if (canEditNote(sessionContext.member, targetMember)) {
      notesToUpdate.push({
        member_id: memberId,
        note: noteCarryForward ? note : "",
        note_carry_forward: noteCarryForward,
        note_priority_high: noteCarryForward ? notePriorityHigh : false,
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
          note_priority_high: notePriorityHigh,
          recorded_by_member_id: sessionContext.member.id,
          recorded_at: nowIso,
        },
        {
          member_id: memberId,
          attendance_week_id: week.id,
          event_type: "small_group_fellowship",
          status: fellowshipStatus,
          note,
          note_priority_high: notePriorityHigh,
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
        note_priority_high: noteUpdate.note_priority_high,
      })
      .eq("id", noteUpdate.member_id);

    if (noteError) {
      return jsonResponse({ error: noteError.message }, 500);
    }
  }

  return jsonResponse({
    status: "ok",
    message: "本週點名已儲存；若多人同時編輯，以最後儲存為準。",
  });
}

async function handleMoveOrganization(
  adminClient: ReturnType<typeof createAdminClient>,
  request: Request,
) {
  const sessionContext = await getSessionContext(adminClient, request.headers);
  if (!sessionContext) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!sessionContext.member.is_admin) {
    return jsonResponse({ error: "Only admins can reorder organizations." }, 403);
  }

  const body = await request.json().catch(() => null);
  const orgType = String(body?.org_type || "") as OrganizationType;
  const orgId = toPositiveInt(body?.org_id);
  const direction = Number(body?.direction) < 0 ? -1 : 1;
  if (!["district", "big_family", "small_group"].includes(orgType) || !orgId) {
    return jsonResponse({ error: "org_type and org_id are required." }, 400);
  }

  const tableName = getOrganizationTableName(orgType);
  const { data: target, error: targetError } = await adminClient
    .from(tableName)
    .select("*")
    .eq("id", orgId)
    .maybeSingle();
  if (targetError) {
    return jsonResponse({ error: targetError.message }, 500);
  }
  if (!target) {
    return jsonResponse({ error: "Organization not found." }, 404);
  }

  let query = adminClient
    .from(tableName)
    .select("*")
    .order("is_active", { ascending: false })
    .order("display_order", { ascending: true, nullsFirst: false })
    .order("name");
  if (orgType === "big_family") {
    query = query.eq("district_id", target.district_id);
  } else if (orgType === "small_group") {
    query = target.big_family_id
      ? query.eq("big_family_id", target.big_family_id)
      : query.eq("district_id", target.district_id).is("big_family_id", null);
  }

  const { data: siblings, error: siblingsError } = await query;
  if (siblingsError) {
    return jsonResponse({ error: siblingsError.message }, 500);
  }

  const rows = siblings || [];
  const currentIndex = rows.findIndex((row) => row.id === orgId);
  const nextIndex = currentIndex + direction;
  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= rows.length) {
    return jsonResponse({ status: "ok", message: "排序已在邊界。" });
  }

  const current = rows[currentIndex];
  const next = rows[nextIndex];
  let currentOrder = Number.isFinite(Number(current.display_order))
    ? Number(current.display_order)
    : currentIndex + 1;
  let nextOrder = Number.isFinite(Number(next.display_order))
    ? Number(next.display_order)
    : nextIndex + 1;
  if (currentOrder === nextOrder) {
    currentOrder = currentIndex + 1;
    nextOrder = nextIndex + 1;
  }

  const { error: currentError } = await adminClient
    .from(tableName)
    .update({ display_order: nextOrder })
    .eq("id", current.id);
  if (currentError) {
    return jsonResponse({ error: currentError.message }, 500);
  }

  const { error: nextError } = await adminClient
    .from(tableName)
    .update({ display_order: currentOrder })
    .eq("id", next.id);
  if (nextError) {
    return jsonResponse({ error: nextError.message }, 500);
  }

  return jsonResponse({ status: "ok" });
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
  const note = normalizeNote(body?.note);
  const equipmentProgress = normalizeEquipmentProgress(body?.equipment_progress);

  if (!fullName || !role) {
    return jsonResponse({ error: "full_name and role are required." }, 400);
  }

  if (!canCreateRole(sessionContext.member, role, isAdmin)) {
    return jsonResponse({ error: "No permission to create this role." }, 403);
  }
  const districtPastorDistrictIds = normalizeDistrictIds(body?.district_ids);
  if (
    isMultiDistrictRole(role) &&
    !districtPastorDistrictIds.every((id) => canManageDistrict(sessionContext.member, id))
  ) {
    return jsonResponse({ error: "No permission to assign one or more districts." }, 403);
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

  const createScopeMode = normalizeCreateScopeMode(body?.create_scope_mode);
  const isEmptyManagedCreate = isManagedOrganizationRole(role) && createScopeMode === "empty" && scope.district_id === null;
  if (!isEmptyManagedCreate && !canManageDistrict(sessionContext.member, scope.district_id)) {
    return jsonResponse({ error: "No permission to create in this district." }, 403);
  }

  const { data, error } = await adminClient
    .from("members")
    .insert({
      full_name: fullName,
      birthday,
      gender,
      note,
      equipment_progress: equipmentProgress,
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

  await syncDistrictPastorDistricts(adminClient, data.id, role, districtPastorDistrictIds);

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
  const canChangeRole = sessionContext.member.is_admin || PREACHER_ROLES.has(sessionContext.member.role);
  const targetRole = canChangeRole
    ? requestedRole || targetMember.role
    : targetMember.role;

  if (!canChangeRole && requestedRole && requestedRole !== targetMember.role) {
    return jsonResponse({ error: "No permission to change role." }, 403);
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
  const districtPastorDistrictIds = normalizeDistrictIds(body?.district_ids);
  if (
    isMultiDistrictRole(targetRole) &&
    !districtPastorDistrictIds.every((id) => canManageDistrict(sessionContext.member, id))
  ) {
    return jsonResponse({ error: "No permission to assign one or more districts." }, 403);
  }

  const updatePayload = {
    full_name: String(body?.full_name || targetMember.full_name).trim(),
    birthday: body?.birthday ? String(body.birthday) : null,
    gender: normalizeGender(body?.gender),
    note: normalizeNote(body?.note),
    equipment_progress: normalizeEquipmentProgress(body?.equipment_progress ?? targetMember.equipment_progress),
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

  await syncDistrictPastorDistricts(adminClient, targetMember.id, targetRole, districtPastorDistrictIds);

  if (SMALL_GROUP_LEADER_ROLES.has(targetRole) && scope.small_group_id && scope.district_id) {
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
    .update({
      is_active: false,
      line_user_id: null,
    })
    .eq("id", targetMember.id);

  if (deleteError) {
    return jsonResponse({ error: deleteError.message }, 500);
  }

  await writeAuditLog(adminClient, sessionContext.member, "archive_member", "members", targetMember.id, {
    full_name: targetMember.full_name,
    role: targetMember.role,
  });

  return jsonResponse({
    status: "ok",
    message: `已停用並封存 ${targetMember.full_name}，歷史點名紀錄已保留。`,
  });
}

async function handlePurgeMember(
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
    return jsonResponse({ error: "不能完全刪除目前登入中的自己。" }, 409);
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

  if (targetMember.is_active) {
    return jsonResponse({ error: "Only archived members can be permanently deleted." }, 409);
  }

  if (!canDeleteMember(sessionContext.member, targetMember)) {
    return jsonResponse({ error: "No permission to delete this member." }, 403);
  }

  await writeAuditLog(adminClient, sessionContext.member, "purge_member", "members", targetMember.id, {
    full_name: targetMember.full_name,
    role: targetMember.role,
    district_id: targetMember.district_id,
    big_family_id: targetMember.big_family_id,
    small_group_id: targetMember.small_group_id,
  });

  const { error: deleteError } = await adminClient
    .from("members")
    .delete()
    .eq("id", targetMember.id);

  if (deleteError) {
    return jsonResponse({ error: deleteError.message }, 500);
  }

  return jsonResponse({
    status: "ok",
    message: "人員與相關資料已完全刪除。",
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

async function handleDeleteInvite(
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
  const inviteId = String(body?.invite_id || "").trim();
  if (!inviteId) {
    return jsonResponse({ error: "invite_id is required." }, 400);
  }

  const { error } = await adminClient
    .from("login_invites")
    .delete()
    .eq("id", inviteId);
  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ status: "ok" });
}

async function handleResetMemberLineBinding(
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
  if (!memberId) {
    return jsonResponse({ error: "member_id is required." }, 400);
  }

  const { data: targetMember, error: targetError } = await adminClient
    .from("members")
    .select("id, full_name, line_user_id")
    .eq("id", memberId)
    .maybeSingle();
  if (targetError) {
    return jsonResponse({ error: targetError.message }, 500);
  }
  if (!targetMember) {
    return jsonResponse({ error: "Member not found." }, 404);
  }

  const nowIso = new Date().toISOString();
  const { error: memberError } = await adminClient
    .from("members")
    .update({ line_user_id: null, last_line_login_at: null })
    .eq("id", memberId);
  if (memberError) {
    return jsonResponse({ error: memberError.message }, 500);
  }

  if (targetMember.line_user_id) {
    const { error: sessionError } = await adminClient
      .from("app_sessions")
      .update({ revoked_at: nowIso })
      .eq("line_user_id", targetMember.line_user_id)
      .is("revoked_at", null);
    if (sessionError) {
      return jsonResponse({ error: sessionError.message }, 500);
    }
  }

  const inviteResetQuery = adminClient
    .from("login_invites")
    .update({ used_at: null, used_by_line_user_id: null })
    .eq("member_id", memberId)
    .not("used_at", "is", null);
  const { error: inviteError } = targetMember.line_user_id
    ? await inviteResetQuery.eq("used_by_line_user_id", targetMember.line_user_id)
    : await inviteResetQuery;
  if (inviteError) {
    return jsonResponse({ error: inviteError.message }, 500);
  }

  return jsonResponse({ status: "ok" });
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

  if (viewer.is_admin || PREACHER_ROLES.has(viewer.role)) {
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    return await attachEquipmentProgress(adminClient, (data || []) as MemberDirectoryRow[]);
  }

  if (PREACHER_ROLES.has(viewer.role)) {
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    return await attachEquipmentProgress(adminClient, (data || []) as MemberDirectoryRow[]);
  }

  if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
    const districtIds = getDistrictPastorDistrictIds(viewer);
    if (!districtIds.length) {
      return [];
    }
    query = query
      .in("district_id", districtIds)
      .in("role", [
        "district_pastor",
        "district_leader",
        "big_family_leader",
        "trainee_big_family_leader",
        "small_group_leader",
        "trainee_small_group_leader",
        "member",
        "best",
      ]);
  } else if (DISTRICT_LEADER_ROLES.has(viewer.role)) {
    if (!viewer.district_id) {
      return [];
    }

    query = query
      .eq("district_id", viewer.district_id)
      .in("role", [
        "district_leader",
        "big_family_leader",
        "trainee_big_family_leader",
        "small_group_leader",
        "trainee_small_group_leader",
        "member",
        "best",
      ]);
  } else if (BIG_FAMILY_LEADER_ROLES.has(viewer.role)) {
    if (!viewer.big_family_id) {
      return [];
    }

    query = query
      .eq("big_family_id", viewer.big_family_id)
      .in("role", [
        "big_family_leader",
        "trainee_big_family_leader",
        "small_group_leader",
        "trainee_small_group_leader",
        "member",
        "best",
      ]);
  } else if (SMALL_GROUP_LEADER_ROLES.has(viewer.role)) {
    if (!viewer.small_group_id) {
      return [];
    }

    query = query
      .eq("small_group_id", viewer.small_group_id)
      .in("role", ["small_group_leader", "trainee_small_group_leader", "member", "best"]);
  } else {
    return [];
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return await attachEquipmentProgress(adminClient, (data || []) as MemberDirectoryRow[]);
}

async function attachEquipmentProgress(
  adminClient: ReturnType<typeof createAdminClient>,
  members: MemberDirectoryRow[],
): Promise<MemberDirectoryRow[]> {
  if (!members.length) {
    return members;
  }

  const memberIds = members.map((member) => member.id);
  const { data, error } = await adminClient
    .from("members")
    .select("id, equipment_progress")
    .in("id", memberIds);

  if (error) {
    console.warn("Equipment progress lookup skipped", error.message);
    return members.map((member) => ({
      ...member,
      equipment_progress: normalizeEquipmentProgress(member.equipment_progress),
    }));
  }

  const progressById = new Map(
    (data || []).map((member) => [
      member.id,
      normalizeEquipmentProgress(member.equipment_progress),
    ]),
  );
  return members.map((member) => ({
    ...member,
    equipment_progress: progressById.get(member.id) || normalizeEquipmentProgress(member.equipment_progress),
  }));
}

async function loadWeeklyAttendanceState(
  adminClient: ReturnType<typeof createAdminClient>,
  attendanceWeekId: number,
  members: MemberDirectoryRow[],
) {
  const attendanceMap = new Map<string, "unknown" | "present" | "absent">();
  const noteMap = new Map<number, WeeklyMemberNote>();
  if (!members.length) {
    return { attendanceMap, noteMap };
  }

  const memberIds = members.map((member) => member.id);
  const membersById = new Map(members.map((member) => [member.id, member]));
  const { data, error } = await adminClient
    .from("attendance_records")
    .select("member_id, event_type, status, note, note_priority_high")
    .eq("attendance_week_id", attendanceWeekId)
    .in("member_id", memberIds);

  if (error) {
    throw new Error(error.message);
  }

  for (const row of data || []) {
    attendanceMap.set(
      `${row.member_id}:${row.event_type}`,
      row.status as "unknown" | "present" | "absent",
    );

    const note = String(row.note || "").trim();
    const memberId = Number(row.member_id);
    if (note || !noteMap.has(memberId)) {
      noteMap.set(memberId, {
        note,
        priorityHigh: Boolean(note && row.note_priority_high),
        carryForward: membersById.get(memberId)?.note_carry_forward !== false,
      });
    }
  }

  for (const member of members) {
    if (noteMap.has(member.id)) {
      continue;
    }

    noteMap.set(member.id, {
      note: member.note_carry_forward ? member.note || "" : "",
      carryForward: member.note_carry_forward !== false,
      priorityHigh: Boolean(member.note_carry_forward && member.note && member.note_priority_high),
    });
  }

  return { attendanceMap, noteMap };
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
  if (!target.is_active) {
    return false;
  }

  if (target.id === viewer.id) {
    return isLoginEnabledMember(viewer);
  }

  if (viewer.is_admin) {
    return true;
  }

  if (PREACHER_ROLES.has(viewer.role)) {
    return true;
  }

  if (DISTRICT_PASTOR_ROLES.has(viewer.role) || DISTRICT_LEADER_ROLES.has(viewer.role)) {
    return (
      canManageDistrict(viewer, target.district_id) &&
      canManageAttendanceTarget(viewer.role, target.role)
    );
  }

  if (BIG_FAMILY_LEADER_ROLES.has(viewer.role)) {
    return (
      Boolean(viewer.big_family_id) &&
      viewer.big_family_id === target.big_family_id &&
      canManageAttendanceTarget(viewer.role, target.role)
    );
  }

  if (SMALL_GROUP_LEADER_ROLES.has(viewer.role)) {
    return (
      Boolean(viewer.small_group_id) &&
      viewer.small_group_id === target.small_group_id &&
      canManageAttendanceTarget(viewer.role, target.role)
    );
  }

  return false;
}

function canEditNote(viewer: MemberDirectoryRow, target: MemberDirectoryRow) {
  if (!target.is_active) {
    return false;
  }

  if (target.id === viewer.id) {
    return isLoginEnabledMember(viewer);
  }

  if (viewer.is_admin) {
    return true;
  }

  if (PREACHER_ROLES.has(viewer.role)) {
    return true;
  }

  if (DISTRICT_PASTOR_ROLES.has(viewer.role) || DISTRICT_LEADER_ROLES.has(viewer.role)) {
    return canManageDistrict(viewer, target.district_id) && canManageAttendanceTarget(viewer.role, target.role);
  }

  if (BIG_FAMILY_LEADER_ROLES.has(viewer.role)) {
    return Boolean(viewer.big_family_id) && viewer.big_family_id === target.big_family_id;
  }

  if (SMALL_GROUP_LEADER_ROLES.has(viewer.role)) {
    return Boolean(viewer.small_group_id) && viewer.small_group_id === target.small_group_id;
  }

  return false;
}

function canManageAttendanceTarget(viewerRole: string, targetRole: string) {
  const viewerOrder = getRolePermissionTier(viewerRole);
  const targetOrder = getRolePermissionTier(targetRole);
  return targetOrder >= viewerOrder && targetOrder < 99;
}

function canUseAdminPanel(viewer: MemberDirectoryRow) {
  return viewer.is_admin || PREACHER_ROLES.has(viewer.role) || DISTRICT_PASTOR_ROLES.has(viewer.role) || DISTRICT_LEADER_ROLES.has(viewer.role);
}

function canUseAttendanceOverview(viewer: MemberDirectoryRow) {
  return viewer.is_admin || OVERVIEW_ROLES.has(viewer.role);
}

function canManageDistrict(viewer: MemberDirectoryRow, districtId: number | null) {
  if (viewer.is_admin || PREACHER_ROLES.has(viewer.role)) {
    return true;
  }
  if (districtId === null) {
    return false;
  }
  if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
    return getDistrictPastorDistrictIds(viewer).includes(districtId);
  }
  return DISTRICT_LEADER_ROLES.has(viewer.role) && viewer.district_id === districtId;
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

  if (PREACHER_ROLES.has(viewer.role)) {
    return true;
  }
  if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
    return [
      "district_leader",
      "big_family_leader",
      "trainee_big_family_leader",
      "small_group_leader",
      "trainee_small_group_leader",
      "member",
      "best",
    ].includes(role);
  }
  return [
    "big_family_leader",
    "trainee_big_family_leader",
    "small_group_leader",
    "trainee_small_group_leader",
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
    canManageDistrict(viewer, target.district_id) &&
    canManageAttendanceTarget(viewer.role, target.role)
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
    canManageDistrict(viewer, target.district_id) &&
    canManageAttendanceTarget(viewer.role, target.role)
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
    .select("*")
    .order("is_active", { ascending: false })
    .order("display_order")
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
    .select("*")
    .order("is_active", { ascending: false })
    .order("display_order")
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

  const enrichedMembers = await attachEquipmentProgress(
    adminClient,
    (members || []) as MemberDirectoryRow[],
  );
  const memberMap = new Map<number, MemberDirectoryRow>(
    enrichedMembers.map((member) => [member.id, member]),
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
            target_line_user_id: target.line_user_id,
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
    members: enrichedMembers,
    invites,
  };
}

async function buildAttendanceOverview(
  adminClient: ReturnType<typeof createAdminClient>,
  viewer: MemberDirectoryRow,
  selectedWeekStart: string,
) {
  const selectedWeek = await ensureWeek(adminClient, selectedWeekStart);
  const weekStarts = buildRecentWeekStarts(selectedWeekStart, 26);
  const members = await loadOverviewMembers(adminClient, viewer);
  const memberIds = members.map((member) => member.id);
  const orgs = await loadOverviewOrganizations(adminClient, members);
  const records = await loadOverviewRecords(
    adminClient,
    selectedWeek.id,
    memberIds,
  );
  const recordMap = new Map(
    records.map((record) => [
      `${record.member_id}:${record.event_type}`,
      record,
    ]),
  );

  const units = buildOverviewUnits({
    viewer,
    members,
    orgs,
    recordMap,
  });

  return {
    scope_label: getOverviewScopeLabel(viewer),
    selected_week_start: selectedWeekStart,
    weeks: weekStarts.map((weekStart) => ({
      week_start_date: weekStart,
      label: buildWeekLabel(weekStart),
    })),
    units,
  };
}

function buildRecentWeekStarts(anchorWeekStart: string, count: number) {
  const weeks: string[] = [];
  const start = parseIsoDate(anchorWeekStart);
  start.setDate(start.getDate() - (count - 1) * 7);
  for (let index = 0; index < count; index += 1) {
    const week = new Date(start);
    week.setDate(start.getDate() + index * 7);
    weeks.push(formatDate(week));
  }
  return weeks;
}

async function loadOverviewMembers(
  adminClient: ReturnType<typeof createAdminClient>,
  viewer: MemberDirectoryRow,
) {
  let query = adminClient
    .from("member_directory")
    .select("*")
    .eq("is_active", true)
    .order("full_name");

  if (!viewer.is_admin && !PREACHER_ROLES.has(viewer.role)) {
    if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
      const districtIds = getDistrictPastorDistrictIds(viewer);
      if (!districtIds.length) {
        return [];
      }
      query = query.in("district_id", districtIds);
    } else if (DISTRICT_LEADER_ROLES.has(viewer.role)) {
      if (!viewer.district_id) {
        return [];
      }
      query = query.eq("district_id", viewer.district_id);
    } else if (BIG_FAMILY_LEADER_ROLES.has(viewer.role)) {
      if (!viewer.big_family_id) {
        return [];
      }
      query = query.eq("big_family_id", viewer.big_family_id);
    } else {
      return [];
    }
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return await attachEquipmentProgress(adminClient, (data || []) as MemberDirectoryRow[]);
}

async function loadOverviewOrganizations(
  adminClient: ReturnType<typeof createAdminClient>,
  members: MemberDirectoryRow[],
) {
  const districtIds = Array.from(
    new Set(members.map((member) => member.district_id).filter(Boolean) as number[]),
  );
  const bigFamilyIds = Array.from(
    new Set(members.map((member) => member.big_family_id).filter(Boolean) as number[]),
  );
  const smallGroupIds = Array.from(
    new Set(members.map((member) => member.small_group_id).filter(Boolean) as number[]),
  );

  const districtQuery = adminClient
    .from("districts")
    .select("*")
    .in("id", districtIds.length ? districtIds : [-1])
    .order("name");
  const bigFamilyQuery = adminClient
    .from("big_families")
    .select("*")
    .in("id", bigFamilyIds.length ? bigFamilyIds : [-1])
    .order("name");
  const smallGroupQuery = adminClient
    .from("small_groups")
    .select("*")
    .in("id", smallGroupIds.length ? smallGroupIds : [-1])
    .order("name");

  const [
    { data: districts, error: districtError },
    { data: bigFamilies, error: bigFamilyError },
    { data: smallGroups, error: smallGroupError },
  ] = await Promise.all([districtQuery, bigFamilyQuery, smallGroupQuery]);

  if (districtError) {
    throw new Error(districtError.message);
  }
  if (bigFamilyError) {
    throw new Error(bigFamilyError.message);
  }
  if (smallGroupError) {
    throw new Error(smallGroupError.message);
  }

  return {
    districts: (districts || []) as DistrictRow[],
    bigFamilies: (bigFamilies || []) as BigFamilyRow[],
    smallGroups: (smallGroups || []) as SmallGroupRow[],
  };
}

async function loadOverviewRecords(
  adminClient: ReturnType<typeof createAdminClient>,
  attendanceWeekId: number,
  memberIds: number[],
) {
  if (!memberIds.length) {
    return [];
  }

  const { data, error } = await adminClient
    .from("attendance_records")
    .select("member_id, event_type, status, note, note_priority_high")
    .eq("attendance_week_id", attendanceWeekId)
    .in("member_id", memberIds);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

function buildOverviewUnits({
  viewer,
  members,
  orgs,
  recordMap,
}: {
  viewer: MemberDirectoryRow;
  members: MemberDirectoryRow[];
  orgs: {
    districts: DistrictRow[];
    bigFamilies: BigFamilyRow[];
    smallGroups: SmallGroupRow[];
  };
  recordMap: Map<string, any>;
}) {
  const units: any[] = [];
  const includeDistricts = viewer.is_admin || PREACHER_ROLES.has(viewer.role) || DISTRICT_PASTOR_ROLES.has(viewer.role);
  const includeBigFamilies = includeDistricts || DISTRICT_LEADER_ROLES.has(viewer.role);
  const districtMap = new Map(orgs.districts.map((district) => [district.id, district]));
  const bigFamilyMap = new Map(orgs.bigFamilies.map((bigFamily) => [bigFamily.id, bigFamily]));

  if (includeDistricts) {
    for (const district of orgs.districts) {
      units.push(createOverviewUnit({
        type: "district",
        level: "district",
        id: district.id,
        name: district.name,
        parentName: null,
        members: members.filter((member) => member.district_id === district.id),
        recordMap,
      }));
    }
  }

  if (includeBigFamilies) {
    for (const bigFamily of orgs.bigFamilies) {
      units.push(createOverviewUnit({
        type: "big_family",
        level: "big_family",
        id: bigFamily.id,
        name: bigFamily.name,
        parentName: bigFamily.district_id
          ? districtMap.get(bigFamily.district_id)?.name || null
          : null,
        members: members.filter((member) => member.big_family_id === bigFamily.id),
        recordMap,
      }));
    }
  }

  for (const smallGroup of orgs.smallGroups) {
    units.push(createOverviewUnit({
      type: "small_group",
      level: "small_group",
      id: smallGroup.id,
      name: smallGroup.name,
      parentName: smallGroup.big_family_id
        ? bigFamilyMap.get(smallGroup.big_family_id)?.name || null
        : smallGroup.district_id
          ? districtMap.get(smallGroup.district_id)?.name || null
          : null,
      members: members.filter((member) => member.small_group_id === smallGroup.id),
      recordMap,
    }));
  }

  return units.filter((unit) => unit.member_count > 0);
}

function createOverviewUnit({
  type,
  level,
  id,
  name,
  parentName,
  members,
  recordMap,
}: {
  type: string;
  level: string;
  id: number;
  name: string;
  parentName: string | null;
  members: MemberDirectoryRow[];
  recordMap: Map<string, any>;
}) {
  return {
    type,
    level,
    id,
    name,
    parent_name: parentName,
    member_count: members.length,
    stats: {
      sunday_service: summarizeOverviewEvent(members, recordMap, "sunday_service"),
      small_group_fellowship: summarizeOverviewEvent(
        members,
        recordMap,
        "small_group_fellowship",
      ),
    },
    detail: {
      sunday_service: buildOverviewEventDetail(members, recordMap, "sunday_service"),
      small_group_fellowship: buildOverviewEventDetail(
        members,
        recordMap,
        "small_group_fellowship",
      ),
    },
  };
}

function summarizeOverviewEvent(
  members: MemberDirectoryRow[],
  recordMap: Map<string, any>,
  eventType: string,
) {
  const stats = createEmptyAttendanceEventAnalytics();
  for (const member of members) {
    const record = recordMap.get(`${member.id}:${eventType}`);
    accumulateAttendanceAnalytics(stats, String(record?.status || "unknown"));
  }
  return stats;
}

function buildOverviewEventDetail(
  members: MemberDirectoryRow[],
  recordMap: Map<string, any>,
  eventType: string,
) {
  const detail: Record<string, any[]> = {
    present: [],
    absent: [],
    unknown: [],
  };

  for (const member of members) {
    const record = recordMap.get(`${member.id}:${eventType}`);
    const status = normalizeAttendanceStatus(record?.status);
    detail[status].push({
      id: member.id,
      full_name: member.full_name,
      role: member.role,
      gender: member.gender,
      note: String(record?.note || "").trim(),
      note_priority_high: Boolean(record?.note && record?.note_priority_high),
    });
  }

  for (const status of Object.keys(detail)) {
    detail[status] = sortDirectoryRows(detail[status]);
  }

  return detail;
}

function getOverviewScopeLabel(viewer: MemberDirectoryRow) {
  if (viewer.is_admin || PREACHER_ROLES.has(viewer.role)) {
    return "全部牧區";
  }

  if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
    const count = getDistrictPastorDistrictIds(viewer).length;
    return count ? `區牧轄區（${count} 區）` : "區牧轄區";
  }

  if (DISTRICT_LEADER_ROLES.has(viewer.role)) {
    return viewer.district_name ? `${viewer.district_name} 轄區` : "所屬區";
  }

  if (BIG_FAMILY_LEADER_ROLES.has(viewer.role)) {
    return viewer.big_family_name ? `${viewer.big_family_name} 轄區` : "所屬大家";
  }

  return "可檢視範圍";
}

function sortDirectoryRows<T extends { role: string; full_name: string }>(rows: T[]) {
  return [...rows].sort((left, right) => {
    const leftRole = getRoleOrder(left.role);
    const rightRole = getRoleOrder(right.role);
    if (leftRole !== rightRole) {
      return leftRole - rightRole;
    }
    return left.full_name.localeCompare(right.full_name, "zh-Hant");
  });
}

function getRoleOrder(role: string) {
  return {
    preacher: 1,
    trainee_preacher: 2,
    district_pastor: 3,
    district_leader: 4,
    big_family_leader: 5,
    trainee_big_family_leader: 6,
    small_group_leader: 7,
    trainee_small_group_leader: 8,
    member: 9,
    best: 10,
  }[role] || 99;
}

function getRolePermissionTier(role: string) {
  return {
    preacher: 1,
    trainee_preacher: 1,
    district_pastor: 2,
    district_leader: 3,
    big_family_leader: 4,
    trainee_big_family_leader: 4,
    small_group_leader: 5,
    trainee_small_group_leader: 5,
    member: 6,
    best: 7,
  }[role] || 99;
}

function getDistrictPastorDistrictIds(member: MemberDirectoryRow) {
  return (member.district_pastor_district_ids || [])
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);
}

function normalizeDistrictIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return Array.from(new Set(value.map(toPositiveInt).filter(Boolean)));
}

async function syncDistrictPastorDistricts(
  adminClient: ReturnType<typeof createAdminClient>,
  memberId: number,
  role: string,
  districtIds: number[],
) {
  const { error: deleteError } = await adminClient
    .from("district_pastor_districts")
    .delete()
    .eq("district_pastor_id", memberId);
  if (deleteError) {
    throw new Error(deleteError.message);
  }
  if (!isMultiDistrictRole(role) || !districtIds.length) {
    return;
  }
  const { error } = await adminClient
    .from("district_pastor_districts")
    .insert(districtIds.map((districtId) => ({ district_pastor_id: memberId, district_id: districtId })));
  if (error) {
    throw new Error(error.message);
  }
}

function isMultiDistrictRole(role: string) {
  return PREACHER_ROLES.has(role) || DISTRICT_PASTOR_ROLES.has(role);
}

async function loadManagedDistricts(
  adminClient: ReturnType<typeof createAdminClient>,
  viewer: MemberDirectoryRow,
): Promise<DistrictRow[]> {
  const query = adminClient
    .from("districts")
    .select("*")
    .order("is_active", { ascending: false })
    .order("display_order")
    .order("name");
  if (viewer.is_admin) {
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }

    return (data || []) as DistrictRow[];
  }

  if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
    const districtIds = getDistrictPastorDistrictIds(viewer);
    if (!districtIds.length) {
      return [];
    }
    const { data, error } = await adminClient
      .from("districts")
      .select("*")
      .in("id", districtIds)
      .order("is_active", { ascending: false })
      .order("display_order")
      .order("name");
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
    .order("display_order")
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
  const createScopeMode = options.autoCreate ? normalizeCreateScopeMode(body?.create_scope_mode) : "existing";

  if (PREACHER_ROLES.has(role)) {
    if (explicitSmallGroupId) {
      const smallGroup = await fetchSmallGroup(adminClient, explicitSmallGroupId);
      if (!smallGroup || !smallGroup.district_id) {
        return null;
      }

      assertOrganizationSelectable(
        "small_group",
        smallGroup,
        options,
        "已封存的小家不能作為新資料歸屬。",
      );

      return {
        district_id: smallGroup.district_id,
        big_family_id: smallGroup.big_family_id,
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

  if (DISTRICT_PASTOR_ROLES.has(role)) {
    return {
      district_id: null,
      big_family_id: null,
      small_group_id: null,
    };
  }

  if (DISTRICT_LEADER_ROLES.has(role)) {
    if (options.autoCreate && createScopeMode === "empty") {
      return {
        district_id: null,
        big_family_id: null,
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

    if (createScopeMode === "existing") {
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

  if (BIG_FAMILY_LEADER_ROLES.has(role)) {
    if (options.autoCreate && createScopeMode === "empty") {
      return {
        district_id: null,
        big_family_id: null,
        small_group_id: null,
      };
    }
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

    if (createScopeMode === "existing") {
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

  if (SMALL_GROUP_LEADER_ROLES.has(role)) {
    if (options.autoCreate && createScopeMode === "empty") {
      return {
        district_id: null,
        big_family_id: null,
        small_group_id: null,
      };
    }
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
        big_family_id: bigFamily?.id || null,
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

    if (createScopeMode === "existing") {
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

  if (MEMBER_ROLES.has(role)) {
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
        big_family_id: bigFamily?.id || null,
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
    "preacher",
    "trainee_preacher",
    "district_pastor",
    "district_leader",
    "big_family_leader",
    "trainee_big_family_leader",
    "small_group_leader",
    "trainee_small_group_leader",
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

function normalizeEquipmentProgress(value: unknown) {
  const normalized = String(value || "").trim();
  return ["none", "growth", "disciple", "leader"].includes(normalized)
    ? normalized
    : "none";
}

function normalizeCreateScopeMode(value: unknown) {
  const normalized = String(value || "").trim();
  return ["empty", "create", "existing"].includes(normalized)
    ? normalized
    : "create";
}

function isManagedOrganizationRole(role: string) {
  return DISTRICT_LEADER_ROLES.has(role) || BIG_FAMILY_LEADER_ROLES.has(role) || SMALL_GROUP_LEADER_ROLES.has(role);
}

function normalizeNote(value: unknown) {
  const note = String(value || "").trim();
  return note.length > NOTE_MAX_LENGTH ? note.slice(0, NOTE_MAX_LENGTH) : note;
}

function toPositiveInt(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

async function writeAuditLog(
  adminClient: ReturnType<typeof createAdminClient>,
  actor: MemberDirectoryRow,
  action: string,
  targetTable: string,
  targetId: number,
  details: Record<string, unknown>,
) {
  const { error } = await adminClient.from("audit_logs").insert({
    actor_member_id: actor.id,
    action,
    target_table: targetTable,
    target_id: targetId,
    details,
  });
  if (error) {
    console.warn("Audit log skipped", error.message);
  }
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
