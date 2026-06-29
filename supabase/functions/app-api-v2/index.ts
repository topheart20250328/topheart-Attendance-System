import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

type MemberRow = {
  id: number;
  full_name: string;
  role: string;
  is_admin: boolean;
  is_active: boolean;
  line_user_id: string | null;
  district_id: number | null;
  district_name: string | null;
  big_family_id: number | null;
  big_family_name: string | null;
  small_group_id: number | null;
  small_group_name: string | null;
  gender: string | null;
  birthday: string | null;
  phone: string | null;
  address: string | null;
  profile_note: string | null;
  note: string | null;
  note_carry_forward: boolean | null;
  note_priority_high: boolean | null;
  equipment_progress: string;
  attendance_started_week: string | null;
  district_pastor_district_ids?: number[] | null;
};

type Scope = {
  district_id: number | null;
  big_family_id: number | null;
  small_group_id: number | null;
};

type OverviewRequestOptions = {
  includeDetail: boolean;
  includeHistory: boolean;
  unitType: string;
  eventType: string;
  completionFilter: string;
  search: string;
  sort: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-app-token, x-client-info, apikey",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const ROLES = new Set([
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
]);
const SMALL_GROUP_LEADER_ROLES = new Set([
  "small_group_leader",
  "trainee_small_group_leader",
]);
const PREACHER_ROLES = new Set(["preacher", "trainee_preacher"]);
const DISTRICT_PASTOR_ROLES = new Set(["district_pastor"]);
const DISTRICT_LEADER_ROLES = new Set(["district_leader"]);
const BIG_FAMILY_LEADER_ROLES = new Set(["big_family_leader", "trainee_big_family_leader"]);
const MEMBER_ROLES = new Set(["member", "best"]);
const LOGIN_ROLES = new Set([
  "preacher",
  "trainee_preacher",
  "district_pastor",
  "district_leader",
  "big_family_leader",
  "trainee_big_family_leader",
  "small_group_leader",
  "trainee_small_group_leader",
]);
const ROLE_ORDER: Record<string, number> = {
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
};
const ROLE_PERMISSION_TIER: Record<string, number> = {
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
};
const VALID_STATUS = new Set(["unknown", "present", "absent"]);
const EQUIPMENT_PROGRESS_VALUES = new Set(["none", "growth", "disciple", "leader"]);
const CREATE_SCOPE_MODES = new Set(["empty", "create", "existing"]);
const NOTE_MAX_LENGTH = 1000;
const PROFILE_NOTE_MAX_LENGTH = 2000;
const PHONE_MAX_LENGTH = 80;
const ADDRESS_MAX_LENGTH = 500;
const MIN_ATTENDANCE_DATE = "2026-04-26";
const MIN_ATTENDANCE_WEEK_START = "2026-04-26";
const ATTENDANCE_RECORD_PAGE_SIZE = 1000;
const HISTORY_RANGES = [
  { key: "month", label: "本月", weeksBack: 0 },
  { key: "three_months", label: "近三個月", weeksBack: 13 },
  { key: "half_year", label: "近半年", weeksBack: 26 },
  { key: "year", label: "近一年", weeksBack: 52 },
];

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action") || "";
    const db = createAdminClient();
    const viewer = await getViewer(db, request.headers);
    if (!viewer) {
      return json({ error: "Unauthorized." }, 401);
    }

    if (request.method === "GET" && action === "attendance-overview") {
      return json(await handleAttendanceOverview(db, viewer, url));
    }

    if (request.method === "GET" && action === "attendance-month-overview") {
      return json(await handleAttendanceMonthOverview(db, viewer, url));
    }

    if (request.method === "GET" && action === "dashboard") {
      return json(await handleDashboard(db, viewer, url));
    }

    if (request.method === "POST" && action === "create-member") {
      return await handleCreateMember(db, viewer, request);
    }

    if (request.method === "POST" && action === "create-members-batch") {
      return await handleCreateMembersBatch(db, viewer, request);
    }

    if (request.method === "POST" && action === "save-attendance") {
      return await handleSaveAttendance(db, viewer, request);
    }

    if (request.method === "POST" && action === "move-organization") {
      return await handleMoveOrganization(db, viewer, request);
    }

    if (request.method === "POST" && action === "delete-invite") {
      return await handleDeleteInvite(db, viewer, request);
    }

    if (request.method === "POST" && action === "reset-member-line-binding") {
      return await handleResetMemberLineBinding(db, viewer, request);
    }

    if (request.method === "POST" && action === "update-member") {
      return await handleUpdateMember(db, viewer, request);
    }

    if (request.method === "POST" && action === "update-member-profile") {
      return await handleUpdateMemberProfile(db, viewer, request);
    }

    if (request.method === "POST" && action === "purge-member") {
      return await handlePurgeMember(db, viewer, request);
    }

    return json({ error: "Unknown action." }, 404);
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : "Unexpected error." }, 500);
  }
});

function createAdminClient() {
  return createClient(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

async function getViewer(db: ReturnType<typeof createAdminClient>, headers: Headers) {
  const token =
    headers.get("X-App-Token")?.trim() ||
    headers.get("Authorization")?.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return null;
  }

  const tokenHash = await sha256Hex(token);
  const nowIso = new Date().toISOString();
  const { data: session, error: sessionError } = await db
    .from("app_sessions")
    .select("id, member_id, expires_at, revoked_at")
    .eq("token_hash", tokenHash)
    .is("revoked_at", null)
    .gt("expires_at", nowIso)
    .maybeSingle();

  if (sessionError || !session) {
    return null;
  }

  const { data: member, error: memberError } = await db
    .from("member_directory")
    .select("*")
    .eq("id", session.member_id)
    .maybeSingle();

  if (memberError || !member || !isLoginEnabled(member as MemberRow)) {
    return null;
  }

  return member as MemberRow;
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
}

function isLoginEnabled(member: MemberRow) {
  return member.is_active && (member.is_admin || LOGIN_ROLES.has(member.role));
}

function canUseManagement(viewer: MemberRow) {
  return viewer.is_admin ||
    PREACHER_ROLES.has(viewer.role) ||
    DISTRICT_PASTOR_ROLES.has(viewer.role) ||
    DISTRICT_LEADER_ROLES.has(viewer.role) ||
    BIG_FAMILY_LEADER_ROLES.has(viewer.role) ||
    SMALL_GROUP_LEADER_ROLES.has(viewer.role);
}

function canCreateMembers(viewer: MemberRow) {
  if (viewer.is_admin) {
    return true;
  }
  return canUseManagement(viewer) &&
    hasManagementScope(viewer) &&
    !BIG_FAMILY_LEADER_ROLES.has(viewer.role) &&
    !SMALL_GROUP_LEADER_ROLES.has(viewer.role);
}

function canChangeMemberActiveStatus(viewer: MemberRow) {
  if (viewer.is_admin) {
    return true;
  }
  return canUseManagement(viewer) &&
    !BIG_FAMILY_LEADER_ROLES.has(viewer.role) &&
    !SMALL_GROUP_LEADER_ROLES.has(viewer.role);
}

function hasManagementScope(viewer: MemberRow) {
  if (viewer.is_admin) {
    return true;
  }
  if (PREACHER_ROLES.has(viewer.role)) {
    return getDistrictPastorDistrictIds(viewer).length > 0 || viewer.district_id !== null;
  }
  if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
    return getDistrictPastorDistrictIds(viewer).length > 0 || viewer.district_id !== null;
  }
  if (DISTRICT_LEADER_ROLES.has(viewer.role)) {
    return viewer.district_id !== null;
  }
  if (BIG_FAMILY_LEADER_ROLES.has(viewer.role)) {
    return viewer.big_family_id !== null;
  }
  if (SMALL_GROUP_LEADER_ROLES.has(viewer.role)) {
    return viewer.small_group_id !== null;
  }
  return false;
}

function canManageDistrict(viewer: MemberRow, districtId: number | null) {
  if (viewer.is_admin) {
    return true;
  }
  if (districtId === null) {
    return false;
  }
  if (PREACHER_ROLES.has(viewer.role)) {
    const districtIds = getDistrictPastorDistrictIds(viewer);
    return districtIds.length
      ? districtIds.includes(districtId)
      : viewer.district_id === districtId;
  }
  if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
    return getDistrictPastorDistrictIds(viewer).includes(districtId);
  }
  return DISTRICT_LEADER_ROLES.has(viewer.role) && viewer.district_id === districtId;
}

function canManageScope(viewer: MemberRow, scope: Scope) {
  if (viewer.is_admin) {
    return true;
  }
  if (PREACHER_ROLES.has(viewer.role)) {
    const districtIds = getDistrictPastorDistrictIds(viewer);
    if (districtIds.length) {
      return scope.district_id !== null && districtIds.includes(scope.district_id);
    }
    return viewer.district_id !== null && viewer.district_id === scope.district_id;
  }
  if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
    return scope.district_id !== null && getDistrictPastorDistrictIds(viewer).includes(scope.district_id);
  }
  if (DISTRICT_LEADER_ROLES.has(viewer.role)) {
    return viewer.district_id !== null && viewer.district_id === scope.district_id;
  }
  if (BIG_FAMILY_LEADER_ROLES.has(viewer.role)) {
    return viewer.big_family_id !== null && viewer.big_family_id === scope.big_family_id;
  }
  if (SMALL_GROUP_LEADER_ROLES.has(viewer.role)) {
    return viewer.small_group_id !== null && viewer.small_group_id === scope.small_group_id;
  }
  return false;
}

function canManageMemberScope(viewer: MemberRow, target: MemberRow) {
  return canManageScope(viewer, {
    district_id: target.district_id,
    big_family_id: target.big_family_id,
    small_group_id: target.small_group_id,
  });
}

function getNonAdminScopeError(viewer: MemberRow, role: string, scope: Scope) {
  if (viewer.is_admin) {
    return "";
  }
  if (DISTRICT_LEADER_ROLES.has(role) && scope.district_id === null) {
    return "非管理員不能選擇留空歸屬。";
  }
  if (BIG_FAMILY_LEADER_ROLES.has(role) && scope.big_family_id === null) {
    return "非管理員不能選擇留空歸屬。";
  }
  if ((SMALL_GROUP_LEADER_ROLES.has(role) || MEMBER_ROLES.has(role)) && scope.small_group_id === null) {
    return "非管理員不能選擇留空歸屬。";
  }
  return "";
}

async function validateRequestedScopeIds(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  body: any,
) {
  if (viewer.is_admin) {
    return "";
  }
  const districtId = toPositiveInt(body?.district_id);
  const bigFamilyId = toPositiveInt(body?.big_family_id);
  const smallGroupId = toPositiveInt(body?.small_group_id);
  let requestedScope: Scope | null = null;

  if (smallGroupId) {
    const smallGroup = await getOne(db, "small_groups", smallGroupId);
    if (!smallGroup?.district_id) {
      return "Invalid small group scope.";
    }
    requestedScope = {
      district_id: smallGroup.district_id,
      big_family_id: smallGroup.big_family_id || null,
      small_group_id: smallGroup.id,
    };
  } else if (bigFamilyId) {
    const bigFamily = await getOne(db, "big_families", bigFamilyId);
    if (!bigFamily?.district_id) {
      return "Invalid big family scope.";
    }
    requestedScope = {
      district_id: bigFamily.district_id,
      big_family_id: bigFamily.id,
      small_group_id: null,
    };
  } else if (districtId) {
    requestedScope = {
      district_id: districtId,
      big_family_id: null,
      small_group_id: null,
    };
  }

  return requestedScope && !canManageScope(viewer, requestedScope)
    ? "只能指定自己管理範圍內的歸屬。"
    : "";
}

function canEditProfile(viewer: MemberRow, target: MemberRow) {
  if (Number(viewer.id) === Number(target.id)) {
    return true;
  }
  if (viewer.is_admin) {
    return true;
  }

  return (
    canManageMemberScope(viewer, target) &&
    canManageAttendanceTarget(viewer.role, target.role)
  );
}

function canCreateRole(viewer: MemberRow, role: string, isAdminFlag: boolean) {
  if (!canUseManagement(viewer) || isAdminFlag) {
    return viewer.is_admin;
  }
  if (viewer.is_admin || PREACHER_ROLES.has(viewer.role)) {
    return viewer.is_admin || canManageAttendanceTarget(viewer.role, role);
  }
  if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
    return canManageAttendanceTarget(viewer.role, role);
  }
  if (DISTRICT_LEADER_ROLES.has(viewer.role)) {
    return canManageAttendanceTarget(viewer.role, role);
  }
  if (BIG_FAMILY_LEADER_ROLES.has(viewer.role) || SMALL_GROUP_LEADER_ROLES.has(viewer.role)) {
    return canManageAttendanceTarget(viewer.role, role);
  }
  return false;
}

function normalizeRole(value: unknown) {
  const role = String(value || "").trim();
  return ROLES.has(role) ? role : "";
}

function normalizeGender(value: unknown) {
  const gender = String(value || "").trim();
  return ["brother", "sister"].includes(gender) ? gender : null;
}

function normalizeEquipmentProgress(value: unknown) {
  const progress = String(value || "").trim();
  return EQUIPMENT_PROGRESS_VALUES.has(progress) ? progress : "none";
}

function normalizeCreateScopeMode(value: unknown) {
  const mode = String(value || "").trim();
  return CREATE_SCOPE_MODES.has(mode) ? mode : "create";
}

function isManagedOrganizationRole(role: string) {
  return DISTRICT_LEADER_ROLES.has(role) || BIG_FAMILY_LEADER_ROLES.has(role) || SMALL_GROUP_LEADER_ROLES.has(role);
}

function getDistrictPastorDistrictIds(member: MemberRow) {
  return (member.district_pastor_district_ids || [])
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);
}

function isAdminModeEnabled(viewer: MemberRow, value: unknown) {
  if (!viewer.is_admin) {
    return false;
  }
  return value !== false && value !== "false";
}

function getEffectiveViewer(viewer: MemberRow, adminMode: boolean) {
  return viewer.is_admin && !adminMode
    ? { ...viewer, is_admin: false }
    : viewer;
}

function getAdminModeFromUrl(viewer: MemberRow, url: URL) {
  return isAdminModeEnabled(viewer, url.searchParams.get("admin_mode"));
}

function getAdminModeFromBody(viewer: MemberRow, body: any) {
  return isAdminModeEnabled(viewer, body?.admin_mode);
}

function normalizeDistrictIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return Array.from(new Set(value.map(toPositiveInt).filter(Boolean)));
}

function toPositiveInt(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

async function handleCreateMember(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  const body = await request.json().catch(() => null);
  const adminMode = getAdminModeFromBody(viewer, body);
  const effectiveViewer = getEffectiveViewer(viewer, adminMode);
  if (!canCreateMembers(effectiveViewer)) {
    return json({ error: "Forbidden." }, 403);
  }

  const result = await createMemberFromBody(db, viewer, effectiveViewer, body, adminMode);
  return json(result.body, result.status);
}

async function handleCreateMembersBatch(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  const body = await request.json().catch(() => null);
  const adminMode = getAdminModeFromBody(viewer, body);
  const effectiveViewer = getEffectiveViewer(viewer, adminMode);
  if (!canCreateMembers(effectiveViewer)) {
    return json({ error: "Forbidden." }, 403);
  }

  const entries = Array.isArray(body?.members) ? body.members.slice(0, 100) : [];
  if (!entries.length) {
    return json({ error: "members is required." }, 400);
  }

  const results = [];
  for (const [index, entry] of entries.entries()) {
    try {
      const result = await createMemberFromBody(db, viewer, effectiveViewer, entry, adminMode);
      const resultBody = result.body as any;
      results.push({
        index,
        ok: result.status >= 200 && result.status < 300,
        member: resultBody.member || null,
        error: resultBody.error || null,
      });
    } catch (error) {
      results.push({
        index,
        ok: false,
        member: null,
        error: error instanceof Error ? error.message : "Unexpected error.",
      });
    }
  }

  const createdCount = results.filter((result) => result.ok).length;
  return json({
    created_count: createdCount,
    failed_count: results.length - createdCount,
    results,
  });
}

async function createMemberFromBody(
  db: ReturnType<typeof createAdminClient>,
  actor: MemberRow,
  viewer: MemberRow,
  body: any,
  adminMode: boolean,
) {
  const fullName = String(body?.full_name || "").trim();
  const role = normalizeRole(body?.role);
  const isAdmin = Boolean(body?.is_admin);
  const note = normalizeNote(body?.note);
  const equipmentProgress = normalizeEquipmentProgress(body?.equipment_progress);
  if (!fullName || !role) {
    return { status: 400, body: { error: "請完整填寫姓名與職分。" } };
  }

  if (!canCreateRole(viewer, role, isAdmin)) {
    return { status: 403, body: { error: "No permission to create this role." } };
  }
  const districtPastorDistrictIds = normalizeDistrictIds(body?.district_ids);
  if (isMultiDistrictRole(role) && !districtPastorDistrictIds.every((id) => canManageDistrict(viewer, id))) {
    return { status: 403, body: { error: "No permission to assign one or more districts." } };
  }

  const createScopeMode = normalizeCreateScopeMode(body?.create_scope_mode);
  if (!viewer.is_admin && isManagedOrganizationRole(role) && createScopeMode === "empty") {
    return { status: 403, body: { error: "非管理員不能選擇留空歸屬。" } };
  }
  if (!viewer.is_admin && DISTRICT_LEADER_ROLES.has(role) && createScopeMode === "create") {
    return { status: 403, body: { error: "非管理員不能新建同名區，請選擇既有區。" } };
  }
  const requestedScopeError = await validateRequestedScopeIds(db, viewer, body);
  if (requestedScopeError) {
    return { status: 403, body: { error: requestedScopeError } };
  }

  const scope = await resolveScope(db, body, role, { autoCreate: true, fullName });
  if (!scope) {
    return { status: 400, body: { error: "Invalid hierarchy scope for this role." } };
  }
  const scopeError = getNonAdminScopeError(viewer, role, scope);
  if (scopeError) {
    return { status: 403, body: { error: scopeError } };
  }
  const isEmptyManagedCreate = isManagedOrganizationRole(role) && createScopeMode === "empty" && scope.district_id === null;
  if (!isEmptyManagedCreate && !canManageScope(viewer, scope)) {
    return { status: 403, body: { error: "No permission to create in this scope." } };
  }

  const attendanceStartedWeek = effectiveViewer.is_admin
    ? normalizeAttendanceStartedWeek(body?.attendance_started_week, getMondayIso(new Date()))
    : getMondayIso(new Date());

  const { data, error } = await db
    .from("members")
    .insert({
      full_name: fullName,
      birthday: body?.birthday ? String(body.birthday) : null,
      role,
      gender: normalizeGender(body?.gender),
      note,
      equipment_progress: equipmentProgress,
      attendance_started_week: attendanceStartedWeek,
      is_admin: viewer.is_admin ? isAdmin : false,
      is_active: body?.is_active !== false,
      district_id: scope.district_id,
      big_family_id: scope.big_family_id,
      small_group_id: scope.small_group_id,
    })
    .select("*")
    .single();

  if (error) {
    return { status: 500, body: { error: error.message } };
  }

  await syncDistrictPastorDistricts(db, data.id, role, districtPastorDistrictIds);

  await writeAuditLog(db, actor, "create_member", "members", data.id, {
    full_name: fullName,
    role,
    equipment_progress: equipmentProgress,
    scope,
    district_ids: districtPastorDistrictIds,
    attendance_started_week: data.attendance_started_week,
    admin_mode: adminMode,
  });

  return { status: 200, body: { member: data } };
}

async function handleUpdateMember(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  const body = await request.json().catch(() => null);
  const adminMode = getAdminModeFromBody(viewer, body);
  const effectiveViewer = getEffectiveViewer(viewer, adminMode);
  if (!canUseManagement(effectiveViewer)) {
    return json({ error: "Forbidden." }, 403);
  }

  const memberId = toPositiveInt(body?.member_id);
  if (!memberId) {
    return json({ error: "member_id is required." }, 400);
  }

  const { data: target, error: targetError } = await db
    .from("member_directory")
    .select("*")
    .eq("id", memberId)
    .maybeSingle();
  if (targetError) {
    return json({ error: targetError.message }, 500);
  }
  if (!target) {
    return json({ error: "Member not found." }, 404);
  }
  if (!canEditProfile(effectiveViewer, target as MemberRow)) {
    return json({ error: "No permission to edit this member." }, 403);
  }

  const requestedRole = normalizeRole(body?.role);
  const canChangeRole = !requestedRole ||
    requestedRole === target.role ||
    canCreateRole(effectiveViewer, requestedRole, false);
  const targetRole = canChangeRole ? requestedRole || target.role : target.role;
  if (!canChangeRole && requestedRole && requestedRole !== target.role) {
    return json({ error: "No permission to change role." }, 403);
  }
  const note = normalizeNote(body?.note);
  const scope = await resolveScope(db, body, targetRole, {
    autoCreate: false,
    fullName: String(body?.full_name || target.full_name).trim(),
  });
  if (!scope) {
    return json({ error: "Invalid hierarchy scope for this role." }, 400);
  }
  const scopeError = getNonAdminScopeError(effectiveViewer, targetRole, scope);
  if (scopeError) {
    return json({ error: scopeError }, 403);
  }
  if (!canManageScope(effectiveViewer, scope)) {
    return json({ error: "No permission to edit this scope." }, 403);
  }
  const districtPastorDistrictIds = normalizeDistrictIds(body?.district_ids);
  if (isMultiDistrictRole(targetRole) && !districtPastorDistrictIds.every((id) => canManageDistrict(effectiveViewer, id))) {
    return json({ error: "No permission to assign one or more districts." }, 403);
  }
  const requestedIsActive = typeof body?.is_active === "boolean"
    ? Boolean(body.is_active)
    : Boolean(target.is_active);
  if (requestedIsActive !== Boolean(target.is_active) && !canChangeMemberActiveStatus(effectiveViewer)) {
    return json({ error: "No permission to change member active status." }, 403);
  }
  const currentAttendanceStartedWeek = getAttendanceStartedWeek(target as MemberRow);
  const attendanceStartedWeek = normalizeAttendanceStartedWeek(
    body?.attendance_started_week ?? currentAttendanceStartedWeek,
    currentAttendanceStartedWeek,
  );
  if (attendanceStartedWeek !== currentAttendanceStartedWeek && !effectiveViewer.is_admin) {
    return json({ error: "Only admins can change attendance start week." }, 403);
  }

  const { error } = await db
    .from("members")
    .update({
      full_name: String(body?.full_name || target.full_name).trim(),
      role: targetRole,
      gender: normalizeGender(body?.gender),
      note,
      equipment_progress: normalizeEquipmentProgress(body?.equipment_progress ?? target.equipment_progress),
      attendance_started_week: attendanceStartedWeek,
      is_admin: effectiveViewer.is_admin ? Boolean(body?.is_admin) : target.is_admin,
      is_active: canChangeMemberActiveStatus(effectiveViewer) ? requestedIsActive : target.is_active,
      district_id: scope.district_id,
      big_family_id: scope.big_family_id,
      small_group_id: scope.small_group_id,
    })
    .eq("id", target.id);

  if (error) {
    return json({ error: error.message }, 500);
  }

  await syncDistrictPastorDistricts(db, target.id, targetRole, districtPastorDistrictIds);

  if (SMALL_GROUP_LEADER_ROLES.has(targetRole) && scope.small_group_id) {
    await db
      .from("small_groups")
      .update({
        district_id: scope.district_id,
        big_family_id: scope.big_family_id,
      })
      .eq("id", scope.small_group_id);
  }

  const { data: updated, error: updatedError } = await db
    .from("member_directory")
    .select("*")
    .eq("id", target.id)
    .single();
  if (updatedError) {
    return json({ error: updatedError.message }, 500);
  }

  await writeAuditLog(db, viewer, "update_member", "members", target.id, {
    before: {
      full_name: target.full_name,
      role: target.role,
      equipment_progress: target.equipment_progress,
      attendance_started_week: currentAttendanceStartedWeek,
      is_active: target.is_active,
      district_id: target.district_id,
      big_family_id: target.big_family_id,
      small_group_id: target.small_group_id,
    },
    after: {
      full_name: updated.full_name,
      role: updated.role,
      equipment_progress: updated.equipment_progress,
      attendance_started_week: updated.attendance_started_week,
      is_active: updated.is_active,
      district_id: updated.district_id,
      big_family_id: updated.big_family_id,
      small_group_id: updated.small_group_id,
      district_ids: districtPastorDistrictIds,
    },
    admin_mode: adminMode,
  });

  return json({ member: updated });
}

async function handleUpdateMemberProfile(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  const body = await request.json().catch(() => null);
  const adminMode = getAdminModeFromBody(viewer, body);
  const effectiveViewer = getEffectiveViewer(viewer, adminMode);
  if (!canUseManagement(effectiveViewer)) {
    return json({ error: "Forbidden." }, 403);
  }

  const memberId = toPositiveInt(body?.member_id);
  if (!memberId) {
    return json({ error: "member_id is required." }, 400);
  }

  const { data: target, error: targetError } = await db
    .from("member_directory")
    .select("*")
    .eq("id", memberId)
    .maybeSingle();
  if (targetError) {
    return json({ error: targetError.message }, 500);
  }
  if (!target) {
    return json({ error: "Member not found." }, 404);
  }
  if (!canEditProfile(effectiveViewer, target as MemberRow)) {
    return json({ error: "No permission to edit this member." }, 403);
  }

  const { data: updated, error } = await db
    .from("members")
    .update({
      birthday: normalizeBirthdayForStorage(body?.birthday),
      phone: normalizeProfileText(body?.phone, PHONE_MAX_LENGTH),
      address: normalizeProfileText(body?.address, ADDRESS_MAX_LENGTH),
      profile_note: normalizeProfileText(body?.profile_note, PROFILE_NOTE_MAX_LENGTH),
    })
    .eq("id", target.id)
    .select("*")
    .single();
  if (error) {
    return json({ error: error.message }, 500);
  }

  await writeAuditLog(db, viewer, "update_member_profile", "members", target.id, {
    admin_mode: adminMode,
  });

  return json({ member: updated });
}

async function handlePurgeMember(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  const body = await request.json().catch(() => null);
  const adminMode = getAdminModeFromBody(viewer, body);
  const effectiveViewer = getEffectiveViewer(viewer, adminMode);
  if (!effectiveViewer.is_admin) {
    return json({ error: "Forbidden." }, 403);
  }

  const memberId = toPositiveInt(body?.member_id);
  if (!memberId) {
    return json({ error: "member_id is required." }, 400);
  }
  if (memberId === viewer.id) {
    return json({ error: "Cannot permanently delete yourself." }, 400);
  }
  const { data: target, error: targetError } = await db
    .from("member_directory")
    .select("*")
    .eq("id", memberId)
    .maybeSingle();
  if (targetError) {
    return json({ error: targetError.message }, 500);
  }
  if (!target) {
    return json({ error: "Member not found." }, 404);
  }
  if (target.is_active) {
    return json({ error: "Only archived members can be permanently deleted." }, 409);
  }
  if (!canEditProfile(effectiveViewer, target as MemberRow)) {
    return json({ error: "No permission to delete this member." }, 403);
  }

  await writeAuditLog(db, viewer, "purge_member", "members", target.id, {
    full_name: target.full_name,
    role: target.role,
    district_id: target.district_id,
    big_family_id: target.big_family_id,
    small_group_id: target.small_group_id,
    admin_mode: adminMode,
  });

  const { error } = await db.from("members").delete().eq("id", target.id);
  if (error) {
    return json({ error: error.message }, 500);
  }
  return json({ ok: true, message: "人員與相關資料已完全刪除。" });
}

async function resolveScope(
  db: ReturnType<typeof createAdminClient>,
  body: any,
  role: string,
  options: { autoCreate: boolean; fullName: string },
): Promise<Scope | null> {
  const districtId = toPositiveInt(body?.district_id);
  const bigFamilyId = toPositiveInt(body?.big_family_id);
  const smallGroupId = toPositiveInt(body?.small_group_id);
  const createScopeMode = options.autoCreate ? normalizeCreateScopeMode(body?.create_scope_mode) : "existing";

  if (PREACHER_ROLES.has(role)) {
    if (smallGroupId) {
      const smallGroup = await getOne(db, "small_groups", smallGroupId);
      if (!smallGroup?.district_id) {
        return null;
      }
      return {
        district_id: smallGroup.district_id,
        big_family_id: smallGroup.big_family_id || null,
        small_group_id: smallGroup.id,
      };
    }
    if (bigFamilyId) {
      const bigFamily = await getOne(db, "big_families", bigFamilyId);
      return bigFamily?.district_id
        ? { district_id: bigFamily.district_id, big_family_id: bigFamily.id, small_group_id: null }
        : null;
    }
    return { district_id: districtId || null, big_family_id: null, small_group_id: null };
  }

  if (DISTRICT_PASTOR_ROLES.has(role)) {
    return { district_id: null, big_family_id: null, small_group_id: null };
  }

  if (DISTRICT_LEADER_ROLES.has(role)) {
    if (options.autoCreate && createScopeMode === "empty") {
      return { district_id: null, big_family_id: null, small_group_id: null };
    }
    if (districtId) {
      return { district_id: districtId, big_family_id: null, small_group_id: null };
    }
    if (!options.autoCreate) {
      return { district_id: null, big_family_id: null, small_group_id: null };
    }
    if (createScopeMode === "existing") {
      return null;
    }
    const district = await insertOne(db, "districts", {
      name: `${options.fullName}區`,
      description: "",
    });
    return { district_id: district.id, big_family_id: null, small_group_id: null };
  }

  if (BIG_FAMILY_LEADER_ROLES.has(role)) {
    if (options.autoCreate && createScopeMode === "empty") {
      return { district_id: null, big_family_id: null, small_group_id: null };
    }
    if (bigFamilyId) {
      const bigFamily = await getOne(db, "big_families", bigFamilyId);
      return bigFamily?.district_id
        ? { district_id: bigFamily.district_id, big_family_id: bigFamily.id, small_group_id: null }
        : null;
    }
    if (!districtId) {
      return options.autoCreate ? null : { district_id: null, big_family_id: null, small_group_id: null };
    }
    if (!options.autoCreate) {
      return { district_id: districtId, big_family_id: null, small_group_id: null };
    }
    if (createScopeMode === "existing") {
      return null;
    }
    const bigFamily = await insertOne(db, "big_families", {
      district_id: districtId,
      name: `${options.fullName}大家`,
      description: "",
    });
    return { district_id: districtId, big_family_id: bigFamily.id, small_group_id: null };
  }

  if (SMALL_GROUP_LEADER_ROLES.has(role) || MEMBER_ROLES.has(role)) {
    if (SMALL_GROUP_LEADER_ROLES.has(role) && options.autoCreate && createScopeMode === "empty") {
      return { district_id: null, big_family_id: null, small_group_id: null };
    }
    if (smallGroupId) {
      const smallGroup = await getOne(db, "small_groups", smallGroupId);
      if (!smallGroup?.district_id) {
        return null;
      }
      return {
        district_id: smallGroup.district_id,
        big_family_id: smallGroup.big_family_id || null,
        small_group_id: smallGroup.id,
      };
    }

    if (MEMBER_ROLES.has(role)) {
      if (bigFamilyId) {
        const bigFamily = await getOne(db, "big_families", bigFamilyId);
        return bigFamily?.district_id
          ? { district_id: bigFamily.district_id, big_family_id: bigFamily.id, small_group_id: null }
          : null;
      }
      return { district_id: districtId || null, big_family_id: null, small_group_id: null };
    }

    if (SMALL_GROUP_LEADER_ROLES.has(role)) {
      if (!districtId) {
        return options.autoCreate ? null : { district_id: null, big_family_id: null, small_group_id: null };
      }
      if (!options.autoCreate) {
        return { district_id: districtId, big_family_id: bigFamilyId || null, small_group_id: null };
      }
      if (createScopeMode === "existing") {
        return null;
      }
      const smallGroup = await insertOne(db, "small_groups", {
        district_id: districtId,
        big_family_id: bigFamilyId || null,
        name: `${options.fullName}小家`,
        description: "",
      });
      return {
        district_id: districtId,
        big_family_id: bigFamilyId || null,
        small_group_id: smallGroup.id,
      };
    }
  }

  return null;
}

async function getOne(db: ReturnType<typeof createAdminClient>, table: string, id: number) {
  const { data, error } = await db.from(table).select("*").eq("id", id).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

async function insertOne(db: ReturnType<typeof createAdminClient>, table: string, payload: any) {
  const { data, error } = await db.from(table).insert(payload).select("*").single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

async function syncDistrictPastorDistricts(
  db: ReturnType<typeof createAdminClient>,
  memberId: number,
  role: string,
  districtIds: number[],
) {
  const { error: deleteError } = await db
    .from("district_pastor_districts")
    .delete()
    .eq("district_pastor_id", memberId);
  if (deleteError) {
    throw new Error(deleteError.message);
  }
  if (!isMultiDistrictRole(role) || !districtIds.length) {
    return;
  }
  const { error } = await db
    .from("district_pastor_districts")
    .insert(districtIds.map((districtId) => ({ district_pastor_id: memberId, district_id: districtId })));
  if (error) {
    throw new Error(error.message);
  }
}

function isMultiDistrictRole(role: string) {
  return PREACHER_ROLES.has(role) || DISTRICT_PASTOR_ROLES.has(role);
}

async function handleDashboard(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  url: URL,
) {
  const weekStart = clampToAllowedAttendanceWeek(url.searchParams.get("week_start") || new Date());
  const week = await ensureWeek(db, weekStart);
  const adminMode = getAdminModeFromUrl(viewer, url);
  const effectiveViewer = getEffectiveViewer(viewer, adminMode);
  const members = await loadVisibleMembers(db, effectiveViewer, { manageAll: adminMode });
  const memberIds = members.map((member) => member.id);
  const records = await loadRecords(db, week.id, memberIds);
  const recordMap = new Map(records.map((record) => [`${record.member_id}:${record.event_type}`, record]));
  const historyMap = await loadMemberHistory(db, members, weekStart);
  const editableMemberIds = new Set(
    members
      .filter((member) => canEditAttendance(effectiveViewer, member))
      .map((member) => member.id),
  );
  const hasExistingAttendanceRecords = records.some((record) => editableMemberIds.has(record.member_id));

  return {
    current_member: viewer,
    week: {
      ...week,
      label: weekStart,
    },
    analytics: createEmptyAnalytics(weekStart),
    attendance_has_existing_records: hasExistingAttendanceRecords,
    roster: members.map((member) => {
      const attendanceApplicable = isAttendanceApplicable(member, weekStart);
      return {
        ...member,
        attendance_applicable: attendanceApplicable,
        note: getFirstRecordValue(recordMap, member.id, "note", member.note || ""),
        note_carry_forward: Boolean(member.note && member.note_carry_forward === true),
        note_priority_high: Boolean(
          getFirstRecordValue(recordMap, member.id, "note_priority_high", member.note_priority_high),
        ),
        is_self: member.id === viewer.id,
        can_edit_attendance: attendanceApplicable && canEditAttendance(effectiveViewer, member),
        can_edit_note: canEditNote(effectiveViewer, member),
        history: isAttendanceRateMember(member)
          ? historyMap.get(member.id) || createEmptyHistorySummary(weekStart)
          : createEmptyHistorySummary(weekStart),
        attendance: {
          sunday_service: attendanceApplicable ? statusOf(recordMap.get(`${member.id}:sunday_service`)?.status) : "unknown",
          small_group_fellowship: attendanceApplicable ? statusOf(recordMap.get(`${member.id}:small_group_fellowship`)?.status) : "unknown",
        },
      };
    }),
  };
}

async function handleSaveAttendance(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  const body = await request.json().catch(() => null);
  const entries = Array.isArray(body?.entries) ? body.entries : [];
  const adminMode = getAdminModeFromBody(viewer, body);
  const effectiveViewer = getEffectiveViewer(viewer, adminMode);
  if (!entries.length) {
    return json({ error: "entries is required." }, 400);
  }

  const requestedWeekStart = getMondayIso(body?.week_start || new Date());
  if (isBeforeMinimumAttendanceWeek(requestedWeekStart)) {
    return json({ error: `不能儲存早於 ${MIN_ATTENDANCE_DATE} 的點名資料。` }, 400);
  }
  const week = await ensureWeek(db, requestedWeekStart);
  const visibleMembers = new Map(
    (await loadVisibleMembers(db, effectiveViewer, { manageAll: adminMode })).map((member) => [member.id, member]),
  );
  const nowIso = new Date().toISOString();
  const rows = [];
  const noteUpdates = [];

  for (const entry of entries) {
    const memberId = toPositiveInt(entry?.member_id);
    const target = visibleMembers.get(memberId);
    if (!target) {
      return json({ error: `No permission to access member ${memberId}.` }, 403);
    }

    const note = normalizeNote(entry?.note);
    const notePriorityHigh = Boolean(note && entry?.note_priority_high);
    if (canEditNote(effectiveViewer, target)) {
      const noteCarryForward = Boolean(note && entry?.note_carry_forward === true);
      noteUpdates.push({
        member_id: memberId,
        note: noteCarryForward ? note : "",
        note_carry_forward: noteCarryForward,
        note_priority_high: noteCarryForward ? notePriorityHigh : false,
      });
    }

    if (isAttendanceApplicable(target, requestedWeekStart) && canEditAttendance(effectiveViewer, target)) {
      rows.push(
        {
          member_id: memberId,
          attendance_week_id: week.id,
          event_type: "sunday_service",
          status: statusOf(entry?.sunday_service),
          note,
          note_priority_high: notePriorityHigh,
          recorded_by_member_id: viewer.id,
          recorded_at: nowIso,
        },
        {
          member_id: memberId,
          attendance_week_id: week.id,
          event_type: "small_group_fellowship",
          status: statusOf(entry?.small_group_fellowship),
          note,
          note_priority_high: notePriorityHigh,
          recorded_by_member_id: viewer.id,
          recorded_at: nowIso,
        },
      );
    }
  }

  if (rows.length) {
    const { error } = await db
      .from("attendance_records")
      .upsert(rows, { onConflict: "member_id,attendance_week_id,event_type" });
    if (error) {
      return json({ error: error.message }, 500);
    }

    await writeAuditLog(db, viewer, "save_attendance", "attendance_records", week.id, {
      week_start: week.week_start_date,
      member_ids: Array.from(new Set(rows.map((row) => row.member_id))),
      admin_mode: adminMode,
    });
  }

  for (const update of noteUpdates) {
    const { error } = await db
      .from("members")
      .update({
        note: update.note,
        note_carry_forward: update.note_carry_forward,
        note_priority_high: update.note_priority_high,
      })
      .eq("id", update.member_id);
    if (error) {
      return json({ error: error.message }, 500);
    }
  }

  return json({ status: "ok", message: "本週點名已儲存；若多人同時編輯，以最後儲存為準。" });
}

async function handleMoveOrganization(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  if (!viewer.is_admin) {
    return json({ error: "Only admins can reorder organizations." }, 403);
  }

  const body = await request.json().catch(() => null);
  const orgType = String(body?.org_type || "");
  const orgId = toPositiveInt(body?.org_id);
  const direction = Number(body?.direction) < 0 ? -1 : 1;
  if (!["district", "big_family", "small_group"].includes(orgType) || !orgId) {
    return json({ error: "org_type and org_id are required." }, 400);
  }

  const tableName = getOrganizationTableName(orgType);
  const { data: target, error: targetError } = await db
    .from(tableName)
    .select("*")
    .eq("id", orgId)
    .maybeSingle();
  if (targetError) {
    return json({ error: targetError.message }, 500);
  }
  if (!target) {
    return json({ error: "Organization not found." }, 404);
  }

  if (orgType === "small_group" && !target.big_family_id) {
    return await moveDirectDistrictChild(db, target, direction);
  }

  let query = db
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
    return json({ error: siblingsError.message }, 500);
  }

  const rows = siblings || [];
  const currentIndex = rows.findIndex((row) => row.id === orgId);
  const nextIndex = currentIndex + direction;
  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= rows.length) {
    return json({ status: "ok", message: "排序已在邊界。" });
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

  const { error: currentError } = await db
    .from(tableName)
    .update({ display_order: nextOrder })
    .eq("id", current.id);
  if (currentError) {
    return json({ error: currentError.message }, 500);
  }

  const { error: nextError } = await db
    .from(tableName)
    .update({ display_order: currentOrder })
    .eq("id", next.id);
  if (nextError) {
    return json({ error: nextError.message }, 500);
  }

  return json({ status: "ok" });
}

async function moveDirectDistrictChild(
  db: ReturnType<typeof createAdminClient>,
  target: any,
  direction: number,
) {
  const [{ data: bigFamilies, error: bigFamiliesError }, { data: smallGroups, error: smallGroupsError }] = await Promise.all([
    db
      .from("big_families")
      .select("*")
      .eq("district_id", target.district_id),
    db
      .from("small_groups")
      .select("*")
      .eq("district_id", target.district_id)
      .is("big_family_id", null),
  ]);
  if (bigFamiliesError) {
    return json({ error: bigFamiliesError.message }, 500);
  }
  if (smallGroupsError) {
    return json({ error: smallGroupsError.message }, 500);
  }

  const rows = [
    ...(bigFamilies || []).map((row) => ({ ...row, org_type: "big_family" })),
    ...(smallGroups || []).map((row) => ({ ...row, org_type: "small_group" })),
  ].sort(compareOrganizationRows);
  const currentIndex = rows.findIndex((row) => row.org_type === "small_group" && row.id === target.id);
  const nextIndex = currentIndex + direction;
  if (currentIndex < 0 || nextIndex < 0 || nextIndex >= rows.length) {
    return json({ status: "ok", message: "排序已在邊界。" });
  }

  const current = rows[currentIndex];
  const reorderedRows = [...rows];
  reorderedRows.splice(currentIndex, 1);
  reorderedRows.splice(nextIndex, 0, current);

  for (const [index, row] of reorderedRows.entries()) {
    const result = await db
      .from(getOrganizationTableName(row.org_type))
      .update({ display_order: index + 1 })
      .eq("id", row.id);
    if (result.error) {
      return json({ error: result.error.message }, 500);
    }
  }

  return json({ status: "ok" });
}

async function handleDeleteInvite(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  if (!viewer.is_admin) {
    return json({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
  const inviteId = String(body?.invite_id || "").trim();
  if (!inviteId) {
    return json({ error: "invite_id is required." }, 400);
  }

  const { error } = await db.from("login_invites").delete().eq("id", inviteId);
  if (error) {
    return json({ error: error.message }, 500);
  }
  return json({ status: "ok" });
}

async function handleResetMemberLineBinding(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  if (!viewer.is_admin) {
    return json({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
  const memberId = toPositiveInt(body?.member_id);
  if (!memberId) {
    return json({ error: "member_id is required." }, 400);
  }

  const { data: target, error: targetError } = await db
    .from("members")
    .select("id, line_user_id")
    .eq("id", memberId)
    .maybeSingle();
  if (targetError) {
    return json({ error: targetError.message }, 500);
  }
  if (!target) {
    return json({ error: "Member not found." }, 404);
  }

  const nowIso = new Date().toISOString();
  const { error: memberError } = await db
    .from("members")
    .update({ line_user_id: null, last_line_login_at: null })
    .eq("id", memberId);
  if (memberError) {
    return json({ error: memberError.message }, 500);
  }

  if (target.line_user_id) {
    const { error: sessionError } = await db
      .from("app_sessions")
      .update({ revoked_at: nowIso })
      .eq("line_user_id", target.line_user_id)
      .is("revoked_at", null);
    if (sessionError) {
      return json({ error: sessionError.message }, 500);
    }
  }

  const inviteResetQuery = db
    .from("login_invites")
    .update({ used_at: null, used_by_line_user_id: null })
    .eq("member_id", memberId)
    .not("used_at", "is", null);
  const { error: inviteError } = target.line_user_id
    ? await inviteResetQuery.eq("used_by_line_user_id", target.line_user_id)
    : await inviteResetQuery;
  if (inviteError) {
    return json({ error: inviteError.message }, 500);
  }

  return json({ status: "ok" });
}

function getOrganizationTableName(orgType: string) {
  if (orgType === "district") {
    return "districts";
  }
  if (orgType === "big_family") {
    return "big_families";
  }
  return "small_groups";
}

async function loadVisibleMembers(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  options: { manageAll?: boolean } = {},
) {
  let query = db.from("member_directory").select("*").eq("is_active", true).order("full_name");
  if (viewer.is_admin) {
    if (viewer.small_group_id && !options.manageAll) {
      query = query.eq("small_group_id", viewer.small_group_id);
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    return await attachEquipmentProgress(db, (data || []) as MemberRow[]);
  }

  if (PREACHER_ROLES.has(viewer.role)) {
    if (!options.manageAll) {
      if (viewer.small_group_id) {
        query = query.eq("small_group_id", viewer.small_group_id);
      } else if (viewer.big_family_id) {
        query = query.eq("big_family_id", viewer.big_family_id);
      } else {
        const districtIds = getDistrictPastorDistrictIds(viewer);
        if (districtIds.length) {
          query = query.in("district_id", districtIds);
        } else if (viewer.district_id) {
          query = query.eq("district_id", viewer.district_id);
        } else {
          return [];
        }
      }
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    const rows = await includeViewerRow(db, viewer, (data || []) as MemberRow[]);
    return await attachEquipmentProgress(db, rows);
  }

  if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
    const districtIds = getDistrictPastorDistrictIds(viewer);
    const scopedDistrictIds = districtIds.length
      ? districtIds
      : viewer.district_id
        ? [viewer.district_id]
        : [];
    if (!scopedDistrictIds.length) {
      return [];
    }
    query = query
      .in("district_id", scopedDistrictIds)
      .in("role", ["district_pastor", "district_leader", "big_family_leader", "trainee_big_family_leader", "small_group_leader", "trainee_small_group_leader", "member", "best"]);
  } else if (DISTRICT_LEADER_ROLES.has(viewer.role)) {
    query = query
      .eq("district_id", viewer.district_id || -1)
      .in("role", ["district_leader", "big_family_leader", "trainee_big_family_leader", "small_group_leader", "trainee_small_group_leader", "member", "best"]);
  } else if (BIG_FAMILY_LEADER_ROLES.has(viewer.role)) {
    query = query
      .eq("big_family_id", viewer.big_family_id || -1)
      .in("role", ["big_family_leader", "trainee_big_family_leader", "small_group_leader", "trainee_small_group_leader", "member", "best"]);
  } else if (SMALL_GROUP_LEADER_ROLES.has(viewer.role)) {
    query = query
      .eq("small_group_id", viewer.small_group_id || -1)
      .in("role", ["small_group_leader", "trainee_small_group_leader", "member", "best"]);
  } else {
    return [];
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  const rows = await includeViewerRow(db, viewer, (data || []) as MemberRow[]);
  return await attachEquipmentProgress(db, rows);
}

async function includeViewerRow(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  rows: MemberRow[],
) {
  if (!viewer?.id || rows.some((member) => Number(member.id) === Number(viewer.id))) {
    return rows;
  }
  const { data, error } = await db
    .from("member_directory")
    .select("*")
    .eq("id", viewer.id)
    .maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data?.is_active === false ? rows : [...rows, data as MemberRow];
}

async function attachEquipmentProgress(
  db: ReturnType<typeof createAdminClient>,
  members: MemberRow[],
) {
  if (!members.length) {
    return members;
  }

  const memberIds = members.map((member) => member.id);
  const { data, error } = await db
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

function canEditAttendance(viewer: MemberRow, target: MemberRow) {
  if (!target.is_active) {
    return false;
  }
  if (target.id === viewer.id) {
    return isLoginEnabled(viewer);
  }
  if (viewer.is_admin || PREACHER_ROLES.has(viewer.role)) {
    return true;
  }
  if (DISTRICT_PASTOR_ROLES.has(viewer.role) || DISTRICT_LEADER_ROLES.has(viewer.role)) {
    return (
      canManageDistrict(viewer, target.district_id) &&
      (canManageAttendanceTarget(viewer.role, target.role) || canEditSameUnitLeaderAttendance(viewer, target))
    );
  }
  if (BIG_FAMILY_LEADER_ROLES.has(viewer.role)) {
    return (
      Boolean(viewer.big_family_id) &&
      viewer.big_family_id === target.big_family_id &&
      (canManageAttendanceTarget(viewer.role, target.role) || canEditSameUnitLeaderAttendance(viewer, target))
    );
  }
  if (SMALL_GROUP_LEADER_ROLES.has(viewer.role)) {
    return (
      Boolean(viewer.small_group_id) &&
      viewer.small_group_id === target.small_group_id &&
      (canManageAttendanceTarget(viewer.role, target.role) || canEditSameUnitLeaderAttendance(viewer, target))
    );
  }
  return false;
}

function canEditNote(viewer: MemberRow, target: MemberRow) {
  return canEditAttendance(viewer, target);
}

function canManageAttendanceTarget(viewerRole: string, targetRole: string) {
  const viewerOrder = ROLE_PERMISSION_TIER[viewerRole] || 99;
  const targetOrder = ROLE_PERMISSION_TIER[targetRole] || 99;
  return targetOrder > viewerOrder && targetOrder < 99;
}

function canEditSameUnitLeaderAttendance(viewer: MemberRow, target: MemberRow) {
  if (viewer.id === target.id) {
    return false;
  }
  if (DISTRICT_LEADER_ROLES.has(viewer.role) && DISTRICT_LEADER_ROLES.has(target.role)) {
    return Boolean(viewer.district_id) && viewer.district_id === target.district_id;
  }
  if (BIG_FAMILY_LEADER_ROLES.has(viewer.role) && BIG_FAMILY_LEADER_ROLES.has(target.role)) {
    return Boolean(viewer.big_family_id) && viewer.big_family_id === target.big_family_id;
  }
  if (SMALL_GROUP_LEADER_ROLES.has(viewer.role) && SMALL_GROUP_LEADER_ROLES.has(target.role)) {
    return Boolean(viewer.small_group_id) && viewer.small_group_id === target.small_group_id;
  }
  return false;
}

function getFirstRecordValue(
  recordMap: Map<string, any>,
  memberId: number,
  key: string,
  fallback: unknown,
) {
  const sunday = recordMap.get(`${memberId}:sunday_service`);
  const fellowship = recordMap.get(`${memberId}:small_group_fellowship`);
  return sunday?.[key] ?? fellowship?.[key] ?? fallback;
}

function createEmptyAnalytics(anchorWeekStart: string) {
  const empty = { present_count: 0, absent_count: 0, unknown_count: 0, confirmed_count: 0 };
  return {
    recent_three_months: {
      label: "近三個月",
      start_date: anchorWeekStart,
      end_date: anchorWeekStart,
      sunday_service: empty,
      small_group_fellowship: empty,
    },
    year_to_date: {
      label: "今年",
      start_date: `${parseIsoDate(anchorWeekStart).getFullYear()}-01-01`,
      end_date: anchorWeekStart,
      sunday_service: empty,
      small_group_fellowship: empty,
    },
  };
}

async function handleAttendanceOverview(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  url: URL,
) {
  const adminMode = getAdminModeFromUrl(viewer, url);
  const effectiveViewer = getEffectiveViewer(viewer, adminMode);
  if (!(effectiveViewer.is_admin || PREACHER_ROLES.has(effectiveViewer.role) || DISTRICT_PASTOR_ROLES.has(effectiveViewer.role) || DISTRICT_LEADER_ROLES.has(effectiveViewer.role) || BIG_FAMILY_LEADER_ROLES.has(effectiveViewer.role) || SMALL_GROUP_LEADER_ROLES.has(effectiveViewer.role))) {
    return { scope_label: "無權限", selected_week_start: "", weeks: [], units: [] };
  }

  const selectedWeekStart = clampToAllowedAttendanceWeek(url.searchParams.get("week_start") || new Date());
  const overviewOptions = getOverviewRequestOptions(url);
  const week = await ensureWeek(db, selectedWeekStart);
  const members = await loadOverviewMembers(db, effectiveViewer);
  const memberIds = members.map((member) => member.id);
  const records = await loadRecords(db, week.id, memberIds);
  const recordMap = new Map(records.map((record) => [`${record.member_id}:${record.event_type}`, record]));
  const historyMap = overviewOptions.includeHistory
    ? await loadMemberHistory(db, members, selectedWeekStart)
    : createEmptyHistoryMap(memberIds, selectedWeekStart);
  const organizationRows = await loadOverviewOrganizationRows(db, members);
  const units = filterOverviewUnits(
    buildUnits(effectiveViewer, members, recordMap, historyMap, organizationRows, overviewOptions, selectedWeekStart),
    overviewOptions,
  );

  return {
    scope_label: getScopeLabel(effectiveViewer),
    selected_week_start: selectedWeekStart,
    detail_mode: overviewOptions.includeDetail ? "full" : "summary",
    weeks: recentWeeks(selectedWeekStart, 26).map((weekStart) => ({
      week_start_date: weekStart,
      label: weekStart,
    })),
    units,
  };
}

async function handleAttendanceMonthOverview(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  url: URL,
) {
  const adminMode = getAdminModeFromUrl(viewer, url);
  const effectiveViewer = getEffectiveViewer(viewer, adminMode);
  if (!(effectiveViewer.is_admin || PREACHER_ROLES.has(effectiveViewer.role) || DISTRICT_PASTOR_ROLES.has(effectiveViewer.role) || DISTRICT_LEADER_ROLES.has(effectiveViewer.role) || BIG_FAMILY_LEADER_ROLES.has(effectiveViewer.role) || SMALL_GROUP_LEADER_ROLES.has(effectiveViewer.role))) {
    return { scope_label: "無權限", selected_month: "", level: "small_group", weeks: [], units: [] };
  }

  const selectedMonth = clampToAllowedAttendanceMonth(url.searchParams.get("month") || formatMonth(new Date()));
  const level = normalizeMonthOverviewLevel(url.searchParams.get("level"));
  const weekStarts = getMonthWeekStarts(selectedMonth);
  const members = await loadOverviewMembers(db, effectiveViewer);
  const organizationRows = await loadOverviewOrganizationRows(db, members);
  const recordsByWeek = await loadMonthOverviewRecords(db, weekStarts, members.map((member) => member.id));
  const units = buildMonthOverviewUnits(level, members, organizationRows, weekStarts, recordsByWeek);

  return {
    scope_label: getScopeLabel(effectiveViewer),
    selected_month: selectedMonth,
    level,
    weeks: weekStarts.map((weekStart) => ({
      week_start_date: weekStart,
      label: weekStart,
    })),
    units,
  };
}

function normalizeMonthOverviewLevel(value: string | null) {
  return ["district", "big_family", "small_group"].includes(String(value))
    ? String(value)
    : "small_group";
}

function clampToAllowedAttendanceMonth(value: string) {
  const currentMonth = formatMonth(new Date());
  const text = /^\d{4}-\d{2}$/.test(String(value || "")) ? String(value) : currentMonth;
  const minimumMonth = MIN_ATTENDANCE_WEEK_START.slice(0, 7);
  if (text < minimumMonth) {
    return minimumMonth;
  }
  if (text > currentMonth) {
    return currentMonth;
  }
  return text;
}

function getMonthWeekStarts(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber - 1, 1);
  const lastDay = new Date(year, monthNumber, 0);
  const day = date.getDay();
  date.setDate(date.getDate() + ((7 - day) % 7));

  const currentWeekStart = getMondayIso(new Date());
  const weeks: string[] = [];
  while (date <= lastDay) {
    const weekStart = formatDate(date);
    if (weekStart >= MIN_ATTENDANCE_WEEK_START && weekStart <= currentWeekStart) {
      weeks.push(weekStart);
    }
    date.setDate(date.getDate() + 7);
  }
  return weeks;
}

async function loadMonthOverviewRecords(
  db: ReturnType<typeof createAdminClient>,
  weekStarts: string[],
  memberIds: number[],
) {
  const recordsByWeek = new Map<string, Map<string, any>>();
  for (const weekStart of weekStarts) {
    recordsByWeek.set(weekStart, new Map());
  }
  if (!weekStarts.length || !memberIds.length) {
    return recordsByWeek;
  }

  const { data: weeks, error: weekError } = await db
    .from("attendance_weeks")
    .select("id, week_start_date")
    .in("week_start_date", weekStarts);
  if (weekError) {
    throw new Error(weekError.message);
  }

  const weekStartById = new Map((weeks || []).map((week) => [week.id, String(week.week_start_date)]));
  const weekIds = Array.from(weekStartById.keys());
  if (!weekIds.length) {
    return recordsByWeek;
  }

  const records = await loadAttendanceRecordsForWeeks(db, weekIds, memberIds, "member_id, attendance_week_id, event_type, status");

  for (const record of records) {
    const weekStart = weekStartById.get(record.attendance_week_id);
    const weekRecords = weekStart ? recordsByWeek.get(weekStart) : null;
    if (weekRecords) {
      weekRecords.set(`${record.member_id}:${record.event_type}`, record);
    }
  }
  return recordsByWeek;
}

async function loadAttendanceRecordsForWeeks(
  db: ReturnType<typeof createAdminClient>,
  weekIds: number[],
  memberIds: number[],
  columns: string,
) {
  const records: any[] = [];
  if (!weekIds.length || !memberIds.length) {
    return records;
  }

  for (let from = 0; ; from += ATTENDANCE_RECORD_PAGE_SIZE) {
    const { data, error } = await db
      .from("attendance_records")
      .select(columns)
      .in("attendance_week_id", weekIds)
      .in("member_id", memberIds)
      .order("attendance_week_id", { ascending: true })
      .order("member_id", { ascending: true })
      .order("event_type", { ascending: true })
      .range(from, from + ATTENDANCE_RECORD_PAGE_SIZE - 1);
    if (error) {
      throw new Error(error.message);
    }
    const page = data || [];
    records.push(...page);
    if (page.length < ATTENDANCE_RECORD_PAGE_SIZE) {
      break;
    }
  }

  return records;
}

function getOverviewRequestOptions(url: URL): OverviewRequestOptions {
  const detailMode = url.searchParams.get("detail") || "full";
  const eventType = url.searchParams.get("event_type") || "sunday_service";
  const unitType = url.searchParams.get("unit_type") || "";
  const completionFilter = url.searchParams.get("completion") || "";
  const sort = url.searchParams.get("sort") || "organization";
  const includeDetail = detailMode !== "summary";
  return {
    includeDetail,
    includeHistory: includeDetail || url.searchParams.get("include_history") === "true",
    unitType: ["", "district", "big_family", "small_group"].includes(unitType) ? unitType : "",
    eventType: ["sunday_service", "small_group_fellowship"].includes(eventType) ? eventType : "sunday_service",
    completionFilter: ["", "zero", "incomplete", "low", "complete"].includes(completionFilter)
      ? completionFilter
      : "",
    search: String(url.searchParams.get("search") || "").trim().toLowerCase(),
    sort: ["organization", "completion_asc", "unknown_desc", "size_desc"].includes(sort)
      ? sort
      : "organization",
  };
}

async function ensureWeek(db: ReturnType<typeof createAdminClient>, weekStart: string) {
  const { data, error } = await db
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

  const { data: inserted, error: insertError } = await db
    .from("attendance_weeks")
    .insert({
    week_start_date: weekStart,
    label: weekStart,
    })
    .select("*")
    .single();
  if (!insertError) {
    return inserted;
  }

  const { data: fallback, error: fallbackError } = await db
    .from("attendance_weeks")
    .select("*")
    .eq("week_start_date", weekStart)
    .single();
  if (fallbackError) {
    throw new Error(insertError.message);
  }
  return fallback;
}

async function loadOverviewMembers(db: ReturnType<typeof createAdminClient>, viewer: MemberRow) {
  let query = db.from("member_directory").select("*").eq("is_active", true).order("full_name");
  if (!viewer.is_admin) {
    if (PREACHER_ROLES.has(viewer.role)) {
      const districtIds = getDistrictPastorDistrictIds(viewer);
      if (districtIds.length) {
        query = query.in("district_id", districtIds);
      } else if (viewer.district_id) {
        query = query.eq("district_id", viewer.district_id);
      } else {
        return [];
      }
    } else if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
      const districtIds = getDistrictPastorDistrictIds(viewer);
      const scopedDistrictIds = districtIds.length
        ? districtIds
        : viewer.district_id
          ? [viewer.district_id]
          : [];
      if (!scopedDistrictIds.length) {
        return [];
      }
      query = query.in("district_id", scopedDistrictIds);
    } else if (DISTRICT_LEADER_ROLES.has(viewer.role)) {
      query = query.eq("district_id", viewer.district_id || -1);
    } else if (BIG_FAMILY_LEADER_ROLES.has(viewer.role)) {
      query = query.eq("big_family_id", viewer.big_family_id || -1);
    } else if (SMALL_GROUP_LEADER_ROLES.has(viewer.role)) {
      query = query.eq("small_group_id", viewer.small_group_id || -1);
    } else {
      return [];
    }
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  const rows = await includeViewerRow(db, viewer, (data || []) as MemberRow[]);
  return await attachEquipmentProgress(db, rows);
}

async function loadRecords(
  db: ReturnType<typeof createAdminClient>,
  weekId: number,
  memberIds: number[],
) {
  if (!memberIds.length) {
    return [];
  }
  const { data, error } = await db
    .from("attendance_records")
    .select("member_id, event_type, status, note, note_priority_high")
    .eq("attendance_week_id", weekId)
    .in("member_id", memberIds);
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
}

async function loadMemberHistory(
  db: ReturnType<typeof createAdminClient>,
  historyMembers: Array<MemberRow | number>,
  anchorWeekStart: string,
) {
  const memberIds = historyMembers.map((item) => typeof item === "number" ? item : item.id);
  const historyMap = new Map<number, Record<string, any>>();
  for (const memberId of memberIds) {
    historyMap.set(memberId, createEmptyHistorySummary(anchorWeekStart));
  }
  if (!memberIds.length) {
    return historyMap;
  }

  const earliestStart = getDateWeeksBefore(anchorWeekStart, 52);
  const { data: weeks, error: weekError } = await db
    .from("attendance_weeks")
    .select("id, week_start_date")
    .gte("week_start_date", earliestStart)
    .lte("week_start_date", anchorWeekStart);
  if (weekError) {
    throw new Error(weekError.message);
  }

  const weekRows = weeks || [];
  const weekIds = weekRows.map((item) => item.id);
  applyHistoryExpectedCounts(historyMap, historyMembers, weekRows, anchorWeekStart);
  if (!weekIds.length) {
    return historyMap;
  }

  const weekStartById = new Map(weekRows.map((item) => [item.id, String(item.week_start_date)]));
  const records = await loadAttendanceRecordsForWeeks(db, weekIds, memberIds, "member_id, attendance_week_id, event_type, status");

  for (const record of records) {
    const memberHistory = historyMap.get(record.member_id);
    const weekStart = weekStartById.get(record.attendance_week_id);
    if (!memberHistory || !weekStart) {
      continue;
    }

    for (const range of HISTORY_RANGES) {
      const startDate = memberHistory[range.key]?.start_date;
      if (startDate && weekStart >= startDate && weekStart <= anchorWeekStart) {
        const member = getHistoryMember(historyMembers, record.member_id);
        if (member && isAttendanceApplicable(member, weekStart)) {
          addHistoryRecord(memberHistory[range.key], record.event_type, record.status);
        }
      }
    }
  }

  finalizeHistoryUnknownCounts(historyMap);
  return historyMap;
}

function createEmptyHistoryMap(memberIds: number[], anchorWeekStart: string) {
  return new Map(memberIds.map((memberId) => [memberId, createEmptyHistorySummary(anchorWeekStart)]));
}

async function loadOverviewOrganizationRows(
  db: ReturnType<typeof createAdminClient>,
  members: MemberRow[],
) {
  const [districts, bigFamilies, smallGroups] = await Promise.all([
    loadByIds(db, "districts", uniqueIds(members.map((member) => member.district_id))),
    loadByIds(db, "big_families", uniqueIds(members.map((member) => member.big_family_id))),
    loadByIds(db, "small_groups", uniqueIds(members.map((member) => member.small_group_id))),
  ]);
  return {
    districts: districts.sort(compareOrganizationRows),
    bigFamilies: bigFamilies.sort(compareOrganizationRows),
    smallGroups: smallGroups.sort(compareOrganizationRows),
    districtsById: new Map(districts.map((district) => [district.id, district])),
    bigFamiliesById: new Map(bigFamilies.map((bigFamily) => [bigFamily.id, bigFamily])),
  };
}

function buildUnits(
  viewer: MemberRow,
  members: MemberRow[],
  recordMap: Map<string, any>,
  historyMap: Map<number, Record<string, any>>,
  organizationRows: Awaited<ReturnType<typeof loadOverviewOrganizationRows>>,
  options: OverviewRequestOptions,
  weekStart: string,
) {
  const units = [];
  const includeDistrict = viewer.is_admin ||
    PREACHER_ROLES.has(viewer.role) ||
    DISTRICT_PASTOR_ROLES.has(viewer.role) ||
    DISTRICT_LEADER_ROLES.has(viewer.role);
  const includeBig = includeDistrict || BIG_FAMILY_LEADER_ROLES.has(viewer.role);

  if (includeDistrict) {
    for (const district of organizationRows.districts) {
      units.push(unit("district", district.id, district.name, null, members.filter((member) => member.district_id === district.id), recordMap, historyMap, options, weekStart));
    }
  }

  if (includeBig) {
    for (const big of organizationRows.bigFamilies) {
      const parentName = organizationRows.districtsById.get(big.district_id)?.name || null;
      units.push(unit("big_family", big.id, big.name, parentName, members.filter((member) => member.big_family_id === big.id), recordMap, historyMap, options, weekStart));
    }
  }

  for (const small of getMonthOverviewSourceRows("small_group", organizationRows)) {
    const parents = [
      organizationRows.bigFamiliesById.get(small.big_family_id)?.name,
      organizationRows.districtsById.get(small.district_id)?.name,
    ].filter(Boolean);
    units.push(unit("small_group", small.id, small.name, parents.join(" / ") || null, members.filter((member) => member.small_group_id === small.id), recordMap, historyMap, options, weekStart));
  }

  return units.filter((item) => item.member_count > 0);
}

function buildMonthOverviewUnits(
  level: string,
  members: MemberRow[],
  organizationRows: Awaited<ReturnType<typeof loadOverviewOrganizationRows>>,
  weekStarts: string[],
  recordsByWeek: Map<string, Map<string, any>>,
) {
  const sourceRows = getMonthOverviewSourceRows(level, organizationRows);

  return sourceRows
    .map((row) => {
      const unitMembers = members.filter((member) => isMonthOverviewUnitMember(member, level, row.id));
      return buildMonthOverviewUnit(level, row, unitMembers, organizationRows, weekStarts, recordsByWeek);
    })
    .filter((item) => item.expected_count > 0);
}

function isMonthOverviewUnitMember(member: MemberRow, level: string, unitId: number) {
  if (level === "district") {
    return member.district_id === unitId;
  }
  if (level === "big_family") {
    return member.big_family_id === unitId;
  }
  return member.small_group_id === unitId;
}

function buildMonthOverviewUnit(
  level: string,
  row: any,
  members: MemberRow[],
  organizationRows: Awaited<ReturnType<typeof loadOverviewOrganizationRows>>,
  weekStarts: string[],
  recordsByWeek: Map<string, Map<string, any>>,
) {
  const leader = getMonthOverviewLeader(level, row, members);
  const weekly = weekStarts.map((weekStart) => {
    const recordMap = recordsByWeek.get(weekStart) || new Map();
    return {
      week_start_date: weekStart,
      sunday_service: stats(members, recordMap, "sunday_service", weekStart),
      small_group_fellowship: stats(members, recordMap, "small_group_fellowship", weekStart),
    };
  });
  const expectedCount = Math.max(
    0,
    ...weekly.flatMap((week) => [
      Number(week.sunday_service.expected_count || 0),
      Number(week.small_group_fellowship.expected_count || 0),
    ]),
  );

  return {
    type: level,
    level,
    id: row.id,
    name: row.name,
    parent_name: getMonthOverviewParentName(level, row, organizationRows),
    leader_name: leader.name,
    leader_gender: leader.gender,
    expected_count: expectedCount,
    monthly_average: {
      sunday_service: averageMonthOverviewStats(weekly.map((week) => week.sunday_service)),
      small_group_fellowship: averageMonthOverviewStats(weekly.map((week) => week.small_group_fellowship)),
    },
    weekly,
  };
}

function getMonthOverviewSourceRows(
  level: string,
  organizationRows: Awaited<ReturnType<typeof loadOverviewOrganizationRows>>,
) {
  if (level === "district") {
    return organizationRows.districts;
  }
  if (level === "big_family") {
    return organizationRows.bigFamilies;
  }
  return [...organizationRows.smallGroups].sort((left, right) =>
    compareMonthOverviewSmallGroups(left, right, organizationRows),
  );
}

function compareMonthOverviewSmallGroups(
  left: any,
  right: any,
  organizationRows: Awaited<ReturnType<typeof loadOverviewOrganizationRows>>,
) {
  const districtCompare = compareOrganizationRows(
    organizationRows.districtsById.get(left.district_id) || { id: left.district_id, name: "", display_order: 0, is_active: true },
    organizationRows.districtsById.get(right.district_id) || { id: right.district_id, name: "", display_order: 0, is_active: true },
  );
  if (districtCompare !== 0) {
    return districtCompare;
  }

  const leftParentOrder = getSmallGroupPeerOrder(left, organizationRows);
  const rightParentOrder = getSmallGroupPeerOrder(right, organizationRows);
  if (leftParentOrder !== rightParentOrder) {
    return leftParentOrder - rightParentOrder;
  }

  if (Boolean(left.big_family_id) !== Boolean(right.big_family_id)) {
    return left.big_family_id ? -1 : 1;
  }
  if (left.big_family_id && right.big_family_id && left.big_family_id !== right.big_family_id) {
    return compareOrganizationRows(
      organizationRows.bigFamiliesById.get(left.big_family_id) || { id: left.big_family_id, name: "", display_order: 0, is_active: true },
      organizationRows.bigFamiliesById.get(right.big_family_id) || { id: right.big_family_id, name: "", display_order: 0, is_active: true },
    );
  }
  return compareOrganizationRows(left, right);
}

function getSmallGroupPeerOrder(
  smallGroup: any,
  organizationRows: Awaited<ReturnType<typeof loadOverviewOrganizationRows>>,
) {
  if (smallGroup.big_family_id) {
    const bigFamily = organizationRows.bigFamiliesById.get(smallGroup.big_family_id);
    if (bigFamily) {
      return Number.isFinite(Number(bigFamily.display_order)) ? Number(bigFamily.display_order) : Number.MAX_SAFE_INTEGER;
    }
  }
  return Number.isFinite(Number(smallGroup.display_order)) ? Number(smallGroup.display_order) : Number.MAX_SAFE_INTEGER;
}

function getMonthOverviewParentName(
  level: string,
  row: any,
  organizationRows: Awaited<ReturnType<typeof loadOverviewOrganizationRows>>,
) {
  if (level === "district") {
    return null;
  }
  if (level === "big_family") {
    return organizationRows.districtsById.get(row.district_id)?.name || null;
  }
  if (row.big_family_id) {
    return organizationRows.bigFamiliesById.get(row.big_family_id)?.name || null;
  }
  return organizationRows.districtsById.get(row.district_id)?.name || null;
}

function getMonthOverviewLeader(level: string, row: any, members: MemberRow[]) {
  const leaderRoles = level === "district"
    ? DISTRICT_LEADER_ROLES
    : level === "big_family"
      ? BIG_FAMILY_LEADER_ROLES
      : SMALL_GROUP_LEADER_ROLES;
  const leaders = members
    .filter((member) => leaderRoles.has(member.role) && isMonthOverviewUnitMember(member, level, row.id))
    .sort((left, right) => ROLE_ORDER[left.role] - ROLE_ORDER[right.role] || left.full_name.localeCompare(right.full_name, "zh-Hant"));
  if (leaders.length) {
    const leader = leaders[0];
    return {
      name: leader.full_name,
      gender: leader.gender || "",
    };
  }
  if (level !== "small_group") {
    return { name: "", gender: "" };
  }
  const fallbackLeaders = [...members]
    .sort((left, right) => ROLE_ORDER[left.role] - ROLE_ORDER[right.role] || left.full_name.localeCompare(right.full_name, "zh-Hant"));
  const fallbackLeader = fallbackLeaders[0];
  return {
    name: fallbackLeader?.full_name || "",
    gender: fallbackLeader?.gender || "",
  };
}

function getSharedGender(members: MemberRow[]) {
  const genders = Array.from(new Set(members.map((member) => member.gender).filter(Boolean)));
  return genders.length === 1 ? genders[0] : "";
}

function averageMonthOverviewStats(statsRows: any[]) {
  if (!statsRows.length) {
    return { present_count: 0, expected_count: 0, rate: null };
  }
  const presentTotal = statsRows.reduce((total, row) => total + Number(row.present_count || 0), 0);
  const expectedTotal = statsRows.reduce((total, row) => total + Number(row.expected_count || 0), 0);
  return {
    present_count: roundToOneDecimal(presentTotal / statsRows.length),
    expected_count: roundToOneDecimal(expectedTotal / statsRows.length),
    rate: expectedTotal ? presentTotal / expectedTotal : null,
  };
}

function compareOrganizationRows(left: any, right: any) {
  if (left.is_active !== right.is_active) {
    return left.is_active ? -1 : 1;
  }
  const leftOrder = Number(left.display_order);
  const rightOrder = Number(right.display_order);
  const hasLeftOrder = Number.isFinite(leftOrder);
  const hasRightOrder = Number.isFinite(rightOrder);
  if (hasLeftOrder || hasRightOrder) {
    if (hasLeftOrder !== hasRightOrder) {
      return hasLeftOrder ? -1 : 1;
    }
    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }
  }
  return String(left.name || "").localeCompare(String(right.name || ""), "zh-Hant");
}

async function loadByIds(db: ReturnType<typeof createAdminClient>, table: string, ids: number[]) {
  if (!ids.length) {
    return [];
  }
  const { data, error } = await db.from(table).select("*").in("id", ids).order("name");
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
}

function unit(
  type: string,
  id: number,
  name: string,
  parentName: string | null,
  members: MemberRow[],
  recordMap: Map<string, any>,
  historyMap: Map<number, Record<string, any>>,
  options: OverviewRequestOptions,
  weekStart: string,
) {
  const result: Record<string, any> = {
    type,
    level: type,
    id,
    name,
    parent_name: parentName,
    member_count: members.length,
    stats: {
      sunday_service: stats(members, recordMap, "sunday_service", weekStart),
      small_group_fellowship: stats(members, recordMap, "small_group_fellowship", weekStart),
    },
  };

  if (options.includeHistory) {
    result.history = aggregateUnitHistory(members, historyMap);
  }
  if (options.includeDetail) {
    result.detail = {
      sunday_service: detail(members, recordMap, "sunday_service", historyMap, weekStart),
      small_group_fellowship: detail(members, recordMap, "small_group_fellowship", historyMap, weekStart),
    };
  }
  return result;
}

function isAttendanceRateMember(member: MemberRow) {
  return member.role !== "best";
}

function getAttendanceStartedWeek(member: MemberRow) {
  return String(member.attendance_started_week || MIN_ATTENDANCE_WEEK_START).slice(0, 10) || MIN_ATTENDANCE_WEEK_START;
}

function isAttendanceApplicable(member: MemberRow, weekStart: string) {
  return getAttendanceStartedWeek(member) <= weekStart;
}

function normalizeAttendanceStartedWeek(value: unknown, fallback = MIN_ATTENDANCE_WEEK_START) {
  const raw = String(value || "").trim();
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(raw)
    ? getMondayIso(raw)
    : getMondayIso(fallback || MIN_ATTENDANCE_WEEK_START);
  return isBeforeMinimumAttendanceWeek(normalized) ? MIN_ATTENDANCE_WEEK_START : normalized;
}

function filterOverviewUnits(units: any[], options: OverviewRequestOptions) {
  const filtered = units.filter((overviewUnit) => {
    if (options.unitType && overviewUnit.type !== options.unitType) {
      return false;
    }
    if (!matchesOverviewCompletion(overviewUnit, options)) {
      return false;
    }
    if (!options.search) {
      return true;
    }
    return getOverviewUnitSearchText(overviewUnit, options).includes(options.search);
  });

  if (options.sort === "organization") {
    return filtered;
  }
  return [...filtered].sort((left, right) => compareOverviewUnitSummary(left, right, options));
}

function matchesOverviewCompletion(overviewUnit: any, options: OverviewRequestOptions) {
  if (!options.completionFilter) {
    return true;
  }
  const metrics = getOverviewStatsMetrics(overviewUnit.stats?.[options.eventType], overviewUnit.member_count);
  if (!metrics.expectedCount) {
    return false;
  }
  if (options.completionFilter === "zero") {
    return metrics.confirmedCount === 0;
  }
  if (options.completionFilter === "incomplete") {
    return metrics.confirmedCount < metrics.expectedCount;
  }
  if (options.completionFilter === "low") {
    return metrics.completionRatio < 0.5;
  }
  if (options.completionFilter === "complete") {
    return metrics.confirmedCount >= metrics.expectedCount;
  }
  return true;
}

function getOverviewUnitSearchText(overviewUnit: any, options: OverviewRequestOptions) {
  const detail = overviewUnit.detail?.[options.eventType] || {};
  const memberText = ["present", "absent", "unknown"]
    .flatMap((key) => detail[key] || [])
    .map((member) => `${member.full_name || ""} ${member.role || ""}`);
  return [
    overviewUnit.name,
    overviewUnit.parent_name,
    overviewUnit.type,
    ...memberText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function compareOverviewUnitSummary(left: any, right: any, options: OverviewRequestOptions) {
  const leftMetrics = getOverviewStatsMetrics(left.stats?.[options.eventType], left.member_count);
  const rightMetrics = getOverviewStatsMetrics(right.stats?.[options.eventType], right.member_count);
  if (options.sort === "completion_asc") {
    const diff = leftMetrics.completionRatio - rightMetrics.completionRatio;
    if (diff) {
      return diff;
    }
  } else if (options.sort === "unknown_desc") {
    const diff = rightMetrics.unknownCount - leftMetrics.unknownCount;
    if (diff) {
      return diff;
    }
  } else if (options.sort === "size_desc") {
    const diff = Number(right.member_count || 0) - Number(left.member_count || 0);
    if (diff) {
      return diff;
    }
  }
  return String(left.name || "").localeCompare(String(right.name || ""), "zh-Hant");
}

function getOverviewStatsMetrics(statsRow: any, memberCount: number) {
  const expectedCount = Number(statsRow?.expected_count ?? memberCount);
  const confirmedCount = Number(statsRow?.confirmed_count || 0);
  const unknownCount = Math.max(0, Number(statsRow?.unknown_count ?? (expectedCount - confirmedCount)));
  return {
    expectedCount,
    confirmedCount,
    unknownCount,
    completionRatio: expectedCount ? confirmedCount / expectedCount : 0,
  };
}

function aggregateUnitHistory(
  members: MemberRow[],
  historyMap: Map<number, Record<string, any>>,
) {
  const rateMembers = members.filter(isAttendanceRateMember);
  const firstHistory = rateMembers
    .map((member) => historyMap.get(member.id))
    .find(Boolean);
  const anchorWeekStart = firstHistory?.month?.end_date || formatDate(new Date());
  const result = createEmptyHistorySummary(anchorWeekStart);

  for (const member of rateMembers) {
    const memberHistory = historyMap.get(member.id);
    if (!memberHistory) {
      continue;
    }

    for (const range of HISTORY_RANGES) {
      const rangeSummary = result[range.key];
      const memberRange = memberHistory[range.key];
      if (!rangeSummary || !memberRange) {
        continue;
      }
      rangeSummary.start_date = memberRange.start_date || rangeSummary.start_date;
      rangeSummary.end_date = memberRange.end_date || rangeSummary.end_date;
      for (const eventType of ["sunday_service", "small_group_fellowship"]) {
        addStats(rangeSummary[eventType], memberRange[eventType]);
      }
    }
  }

  return result;
}

function addStats(target: any, source: any) {
  if (!target || !source) {
    return;
  }
  target.present_count += Number(source.present_count || 0);
  target.absent_count += Number(source.absent_count || 0);
  target.unknown_count += Number(source.unknown_count || 0);
  target.confirmed_count += Number(source.confirmed_count || 0);
  target.expected_count += Number(source.expected_count || 0);
}

function stats(members: MemberRow[], recordMap: Map<string, any>, eventType: string, weekStart = MIN_ATTENDANCE_WEEK_START) {
  const rateMembers = members.filter((member) => isAttendanceRateMember(member) && isAttendanceApplicable(member, weekStart));
  const result = {
    present_count: 0,
    absent_count: 0,
    unknown_count: 0,
    confirmed_count: 0,
    expected_count: rateMembers.length,
  };
  for (const member of rateMembers) {
    const status = normalizeStatus(recordMap.get(`${member.id}:${eventType}`)?.status);
    if (status === "present") {
      result.present_count += 1;
      result.confirmed_count += 1;
    } else if (status === "absent") {
      result.absent_count += 1;
      result.confirmed_count += 1;
    } else {
      result.unknown_count += 1;
    }
  }
  return {
    ...result,
    rate: result.expected_count ? result.present_count / result.expected_count : null,
  };
}

function detail(
  members: MemberRow[],
  recordMap: Map<string, any>,
  eventType: string,
  historyMap: Map<number, Record<string, any>>,
  weekStart = MIN_ATTENDANCE_WEEK_START,
) {
  const result: Record<string, any[]> = { present: [], absent: [], unknown: [] };
  for (const member of members) {
    if (isAttendanceRateMember(member) && !isAttendanceApplicable(member, weekStart)) {
      continue;
    }
    const record = recordMap.get(`${member.id}:${eventType}`);
    const status = normalizeStatus(record?.status);
    const memberHistory = historyMap.get(member.id) || createEmptyHistorySummary(formatDate(new Date()));
    const detailHistory = isAttendanceRateMember(member)
      ? memberHistory
      : createEmptyHistorySummary(memberHistory.month?.end_date || formatDate(new Date()));
    result[status].push({
      id: member.id,
      full_name: member.full_name,
      role: member.role,
      gender: member.gender,
      birthday: member.birthday,
      equipment_progress: member.equipment_progress || "none",
      note: String(record?.note || "").trim(),
      note_priority_high: Boolean(record?.note && record?.note_priority_high),
      history: detailHistory,
    });
  }
  return result;
}

function createEmptyHistorySummary(anchorWeekStart: string) {
  return Object.fromEntries(
    HISTORY_RANGES.map((range) => [
      range.key,
      {
        label: range.label,
        start_date:
          range.key === "month"
            ? getMonthStart(anchorWeekStart)
            : getDateWeeksBefore(anchorWeekStart, range.weeksBack),
        end_date: anchorWeekStart,
        sunday_service: createEmptyEventStats(),
        small_group_fellowship: createEmptyEventStats(),
      },
    ]),
  );
}

function createEmptyEventStats() {
  return { present_count: 0, absent_count: 0, unknown_count: 0, confirmed_count: 0, expected_count: 0 };
}

function addHistoryRecord(range: any, eventType: string, value: unknown) {
  const stats = range?.[eventType];
  if (!stats) {
    return;
  }
  const status = normalizeStatus(value);
  if (status === "present") {
    stats.present_count += 1;
    stats.confirmed_count += 1;
  } else if (status === "absent") {
    stats.absent_count += 1;
    stats.confirmed_count += 1;
  }
}

function applyHistoryExpectedCounts(
  historyMap: Map<number, Record<string, any>>,
  historyMembers: Array<MemberRow | number>,
  weekRows: any[],
  anchorWeekStart: string,
) {
  for (const [memberId, memberHistory] of historyMap.entries()) {
    const member = getHistoryMember(historyMembers, memberId);
    for (const range of HISTORY_RANGES) {
      const startDate = range.key === "month"
        ? getMonthStart(anchorWeekStart)
        : getDateWeeksBefore(anchorWeekStart, range.weeksBack);
      const expectedCount = member
        ? weekRows.filter((week) => {
          const weekStart = String(week.week_start_date);
          return weekStart >= startDate && weekStart <= anchorWeekStart && isAttendanceApplicable(member, weekStart);
        }).length
        : 0;
      const rangeHistory = memberHistory[range.key] as any;
      for (const eventType of ["sunday_service", "small_group_fellowship"]) {
        if (rangeHistory?.[eventType]) {
          rangeHistory[eventType].expected_count = expectedCount;
        }
      }
    }
  }
}

function getHistoryMember(historyMembers: Array<MemberRow | number>, memberId: number) {
  const member = historyMembers.find((item) => typeof item !== "number" && item.id === memberId);
  return typeof member === "number" ? null : member || null;
}

function finalizeHistoryUnknownCounts(historyMap: Map<number, Record<string, any>>) {
  for (const memberHistory of historyMap.values()) {
    for (const range of HISTORY_RANGES) {
      const rangeHistory = memberHistory[range.key] as any;
      for (const eventType of ["sunday_service", "small_group_fellowship"]) {
        const stats = rangeHistory?.[eventType];
        if (!stats) {
          continue;
        }
        stats.unknown_count = Math.max(
          0,
          Number(stats.expected_count || 0) - Number(stats.confirmed_count || 0),
        );
      }
    }
  }
}

function normalizeStatus(value: unknown) {
  const status = String(value || "unknown").trim();
  return VALID_STATUS.has(status) ? status : "unknown";
}

function statusOf(value: unknown) {
  return normalizeStatus(value);
}

function uniqueIds(values: Array<number | null>) {
  return Array.from(new Set(values.filter(Boolean) as number[]));
}

function normalizeNote(value: unknown) {
  const note = String(value || "").trim();
  return note.length > NOTE_MAX_LENGTH ? note.slice(0, NOTE_MAX_LENGTH) : note;
}

function normalizeProfileText(value: unknown, maxLength: number) {
  const text = String(value || "").trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function normalizeBirthdayForStorage(value: unknown) {
  const text = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

function recentWeeks(anchorWeekStart: string, count: number) {
  const start = parseIsoDate(anchorWeekStart);
  start.setDate(start.getDate() - (count - 1) * 7);
  return Array.from({ length: count }, (_, index) => {
    const week = new Date(start);
    week.setDate(start.getDate() + index * 7);
    return formatDate(week);
  });
}

function getScopeLabel(viewer: MemberRow) {
  if (viewer.is_admin) {
    return "全部牧區";
  }
  if (PREACHER_ROLES.has(viewer.role)) {
    const count = getDistrictPastorDistrictIds(viewer).length;
    if (count) {
      return `傳道人轄區（${count} 區）`;
    }
    return viewer.district_name ? `${viewer.district_name} 轄區` : "傳道人轄區";
  }
  if (DISTRICT_PASTOR_ROLES.has(viewer.role)) {
    const count = getDistrictPastorDistrictIds(viewer).length;
    return count ? `區牧轄區（${count} 區）` : "區牧轄區";
  }
  if (DISTRICT_LEADER_ROLES.has(viewer.role)) {
    return viewer.district_name ? `${viewer.district_name} 轄區` : "所屬區";
  }
  if (SMALL_GROUP_LEADER_ROLES.has(viewer.role)) {
    return viewer.small_group_name ? `${viewer.small_group_name} 小家` : "所屬小家";
  }
  return viewer.big_family_name ? `${viewer.big_family_name} 轄區` : "所屬大家";
}

function getMonthStart(anchorWeekStart: string) {
  const date = parseIsoDate(anchorWeekStart);
  return formatDate(new Date(date.getFullYear(), date.getMonth(), 1));
}

function getDateWeeksBefore(anchorWeekStart: string, weeksBack: number) {
  const date = parseIsoDate(anchorWeekStart);
  date.setDate(date.getDate() - weeksBack * 7);
  return formatDate(date);
}

function formatMonth(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function addWeeksIso(weekStart: string, weeks: number) {
  const date = parseIsoDate(weekStart);
  date.setDate(date.getDate() + weeks * 7);
  return formatDate(date);
}

async function writeAuditLog(
  db: ReturnType<typeof createAdminClient>,
  actor: MemberRow,
  action: string,
  targetTable: string,
  targetId: number,
  details: Record<string, unknown>,
) {
  const { error } = await db.from("audit_logs").insert({
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
  const date = source instanceof Date ? new Date(source) : parseIsoDate(String(source));
  const day = date.getDay();
  const diff = -day;
  date.setDate(date.getDate() + diff);
  return formatDate(date);
}

function isBeforeMinimumAttendanceWeek(weekStart: string) {
  return weekStart < MIN_ATTENDANCE_WEEK_START;
}

function clampToAllowedAttendanceWeek(source: Date | string) {
  const weekStart = getMondayIso(source);
  return isBeforeMinimumAttendanceWeek(weekStart) ? MIN_ATTENDANCE_WEEK_START : weekStart;
}

function parseIsoDate(isoDate: string) {
  const [year, month, day] = String(isoDate).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
