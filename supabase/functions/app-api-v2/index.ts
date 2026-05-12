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
  note: string | null;
  note_carry_forward: boolean | null;
  note_priority_high: boolean | null;
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
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const ROLES = new Set([
  "preacher",
  "district_leader",
  "big_family_leader",
  "small_group_leader",
  "trainee_small_group_leader",
  "member",
  "best",
]);
const SMALL_GROUP_LEADER_ROLES = new Set([
  "small_group_leader",
  "trainee_small_group_leader",
]);
const MEMBER_ROLES = new Set(["member", "best"]);
const LOGIN_ROLES = new Set([
  "preacher",
  "district_leader",
  "big_family_leader",
  "small_group_leader",
  "trainee_small_group_leader",
]);
const ROLE_ORDER: Record<string, number> = {
  preacher: 1,
  district_leader: 2,
  big_family_leader: 3,
  small_group_leader: 4,
  trainee_small_group_leader: 4,
  member: 6,
  best: 7,
};
const VALID_STATUS = new Set(["unknown", "present", "absent"]);
const NOTE_MAX_LENGTH = 1000;
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
  const token = headers.get("Authorization")?.replace(/^Bearer\s+/i, "").trim();
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
  return viewer.is_admin || viewer.role === "district_leader";
}

function canManageDistrict(viewer: MemberRow, districtId: number | null) {
  return viewer.is_admin || (districtId !== null && viewer.district_id === districtId);
}

function canEditProfile(viewer: MemberRow, target: MemberRow) {
  if (viewer.is_admin) {
    return true;
  }

  return (
    viewer.role === "district_leader" &&
    Boolean(viewer.district_id) &&
    target.district_id === viewer.district_id &&
    MEMBER_ROLES.has(target.role)
  );
}

function normalizeRole(value: unknown) {
  const role = String(value || "").trim();
  return ROLES.has(role) ? role : "";
}

function normalizeGender(value: unknown) {
  const gender = String(value || "").trim();
  return ["brother", "sister"].includes(gender) ? gender : null;
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
  if (!canUseManagement(viewer)) {
    return json({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
  const result = await createMemberFromBody(db, viewer, body);
  return json(result.body, result.status);
}

async function handleCreateMembersBatch(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  if (!canUseManagement(viewer)) {
    return json({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
  const entries = Array.isArray(body?.members) ? body.members.slice(0, 100) : [];
  if (!entries.length) {
    return json({ error: "members is required." }, 400);
  }

  const results = [];
  for (const [index, entry] of entries.entries()) {
    try {
      const result = await createMemberFromBody(db, viewer, entry);
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
  viewer: MemberRow,
  body: any,
) {
  const fullName = String(body?.full_name || "").trim();
  const role = normalizeRole(body?.role);
  const isAdmin = Boolean(body?.is_admin);
  const note = normalizeNote(body?.note);
  if (!fullName || !role) {
    return { status: 400, body: { error: "請完整填寫姓名與職分。" } };
  }

  if (!viewer.is_admin) {
    const allowed = ["big_family_leader", "small_group_leader", "trainee_small_group_leader", "member", "best"];
    if (isAdmin || !allowed.includes(role)) {
      return { status: 403, body: { error: "No permission to create this role." } };
    }
  }

  const scope = await resolveScope(db, body, role, { autoCreate: true, fullName });
  if (!scope) {
    return { status: 400, body: { error: "Invalid hierarchy scope for this role." } };
  }
  if (!canManageDistrict(viewer, scope.district_id)) {
    return { status: 403, body: { error: "No permission to create in this district." } };
  }

  const { data, error } = await db
    .from("members")
    .insert({
      full_name: fullName,
      role,
      gender: normalizeGender(body?.gender),
      note,
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

  await writeAuditLog(db, viewer, "create_member", "members", data.id, {
    full_name: fullName,
    role,
    scope,
  });

  return { status: 200, body: { member: data } };
}

async function handleUpdateMember(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  if (!canUseManagement(viewer)) {
    return json({ error: "Forbidden." }, 403);
  }

  const body = await request.json().catch(() => null);
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
  if (!canEditProfile(viewer, target as MemberRow)) {
    return json({ error: "No permission to edit this member." }, 403);
  }

  const requestedRole = normalizeRole(body?.role);
  const targetRole = viewer.is_admin ? requestedRole || target.role : target.role;
  const note = normalizeNote(body?.note);
  const scope = await resolveScope(db, body, targetRole, {
    autoCreate: false,
    fullName: String(body?.full_name || target.full_name).trim(),
  });
  if (!scope) {
    return json({ error: "Invalid hierarchy scope for this role." }, 400);
  }
  if (!canManageDistrict(viewer, scope.district_id)) {
    return json({ error: "No permission to edit this district." }, 403);
  }

  const { error } = await db
    .from("members")
    .update({
      full_name: String(body?.full_name || target.full_name).trim(),
      role: targetRole,
      gender: normalizeGender(body?.gender),
      note,
      is_admin: viewer.is_admin ? Boolean(body?.is_admin) : target.is_admin,
      is_active: body?.is_active !== false,
      district_id: scope.district_id,
      big_family_id: scope.big_family_id,
      small_group_id: scope.small_group_id,
    })
    .eq("id", target.id);

  if (error) {
    return json({ error: error.message }, 500);
  }

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
      is_active: target.is_active,
      district_id: target.district_id,
      big_family_id: target.big_family_id,
      small_group_id: target.small_group_id,
    },
    after: {
      full_name: updated.full_name,
      role: updated.role,
      is_active: updated.is_active,
      district_id: updated.district_id,
      big_family_id: updated.big_family_id,
      small_group_id: updated.small_group_id,
    },
  });

  return json({ member: updated });
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

  if (role === "preacher") {
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
    return { district_id: districtId || null, big_family_id: null, small_group_id: null };
  }

  if (role === "district_leader") {
    if (districtId) {
      return { district_id: districtId, big_family_id: null, small_group_id: null };
    }
    if (!options.autoCreate) {
      return { district_id: null, big_family_id: null, small_group_id: null };
    }
    const district = await insertOne(db, "districts", {
      name: `${options.fullName}區`,
      description: "",
    });
    return { district_id: district.id, big_family_id: null, small_group_id: null };
  }

  if (role === "big_family_leader") {
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
    const bigFamily = await insertOne(db, "big_families", {
      district_id: districtId,
      name: `${options.fullName}大家`,
      description: "",
    });
    return { district_id: districtId, big_family_id: bigFamily.id, small_group_id: null };
  }

  if (SMALL_GROUP_LEADER_ROLES.has(role) || MEMBER_ROLES.has(role)) {
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

    if (SMALL_GROUP_LEADER_ROLES.has(role)) {
      if (!districtId) {
        return options.autoCreate ? null : { district_id: null, big_family_id: null, small_group_id: null };
      }
      if (!options.autoCreate) {
        return { district_id: districtId, big_family_id: bigFamilyId || null, small_group_id: null };
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

async function handleDashboard(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  url: URL,
) {
  const weekStart = getMondayIso(url.searchParams.get("week_start") || new Date());
  const week = await ensureWeek(db, weekStart);
  const manageAll = url.searchParams.get("manage_all") === "true";
  const members = await loadVisibleMembers(db, viewer, { manageAll });
  const memberIds = members.map((member) => member.id);
  const records = await loadRecords(db, week.id, memberIds);
  const recordMap = new Map(records.map((record) => [`${record.member_id}:${record.event_type}`, record]));

  return {
    current_member: viewer,
    week: {
      ...week,
      label: weekStart,
    },
    analytics: createEmptyAnalytics(weekStart),
    roster: members.map((member) => ({
      ...member,
      note: getFirstRecordValue(recordMap, member.id, "note", member.note || ""),
      note_carry_forward: Boolean(member.note && member.note_carry_forward === true),
      note_priority_high: Boolean(
        getFirstRecordValue(recordMap, member.id, "note_priority_high", member.note_priority_high),
      ),
      is_self: member.id === viewer.id,
      can_edit_attendance: canEditAttendance(viewer, member),
      can_edit_note: canEditNote(viewer, member),
      attendance: {
        sunday_service: statusOf(recordMap.get(`${member.id}:sunday_service`)?.status),
        small_group_fellowship: statusOf(recordMap.get(`${member.id}:small_group_fellowship`)?.status),
      },
    })),
  };
}

async function handleSaveAttendance(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  request: Request,
) {
  const body = await request.json().catch(() => null);
  const entries = Array.isArray(body?.entries) ? body.entries : [];
  const manageAll = body?.manage_all === true;
  if (!entries.length) {
    return json({ error: "entries is required." }, 400);
  }

  const week = await ensureWeek(db, getMondayIso(body?.week_start || new Date()));
  const visibleMembers = new Map(
    (await loadVisibleMembers(db, viewer, { manageAll })).map((member) => [member.id, member]),
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
    if (canEditNote(viewer, target)) {
      const noteCarryForward = Boolean(note && entry?.note_carry_forward === true);
      noteUpdates.push({
        member_id: memberId,
        note: noteCarryForward ? note : "",
        note_carry_forward: noteCarryForward,
        note_priority_high: noteCarryForward ? notePriorityHigh : false,
      });
    }

    if (canEditAttendance(viewer, target)) {
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
      manage_all: manageAll,
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
  if (viewer.is_admin || viewer.role === "preacher") {
    if (viewer.small_group_id && !options.manageAll) {
      query = query.eq("small_group_id", viewer.small_group_id);
    }
    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    return (data || []) as MemberRow[];
  }

  if (viewer.role === "district_leader") {
    query = query
      .eq("district_id", viewer.district_id || -1)
      .in("role", ["district_leader", "big_family_leader", "small_group_leader", "trainee_small_group_leader", "member", "best"]);
  } else if (viewer.role === "big_family_leader") {
    query = query
      .eq("big_family_id", viewer.big_family_id || -1)
      .in("role", ["big_family_leader", "small_group_leader", "trainee_small_group_leader", "member", "best"]);
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
  return (data || []) as MemberRow[];
}

function canEditAttendance(viewer: MemberRow, target: MemberRow) {
  if (!target.is_active) {
    return false;
  }
  if (target.id === viewer.id) {
    return isLoginEnabled(viewer);
  }
  if (viewer.is_admin || viewer.role === "preacher") {
    return true;
  }
  if (viewer.role === "district_leader") {
    return (
      Boolean(viewer.district_id) &&
      viewer.district_id === target.district_id &&
      canManageAttendanceTarget(viewer.role, target.role)
    );
  }
  if (viewer.role === "big_family_leader") {
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

function canEditNote(viewer: MemberRow, target: MemberRow) {
  return canEditAttendance(viewer, target);
}

function canManageAttendanceTarget(viewerRole: string, targetRole: string) {
  const viewerOrder = ROLE_ORDER[viewerRole] || 99;
  const targetOrder = ROLE_ORDER[targetRole] || 99;
  return targetOrder >= viewerOrder && targetOrder < 99;
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
  if (!(viewer.is_admin || ["preacher", "district_leader", "big_family_leader"].includes(viewer.role))) {
    return { scope_label: "無權限", selected_week_start: "", weeks: [], units: [] };
  }

  const selectedWeekStart = getMondayIso(url.searchParams.get("week_start") || new Date());
  const overviewOptions = getOverviewRequestOptions(url);
  const week = await ensureWeek(db, selectedWeekStart);
  const members = await loadOverviewMembers(db, viewer);
  const memberIds = members.map((member) => member.id);
  const records = await loadRecords(db, week.id, memberIds);
  const recordMap = new Map(records.map((record) => [`${record.member_id}:${record.event_type}`, record]));
  const historyMap = overviewOptions.includeHistory
    ? await loadMemberHistory(db, memberIds, selectedWeekStart)
    : createEmptyHistoryMap(memberIds, selectedWeekStart);
  const units = filterOverviewUnits(
    await buildUnits(db, viewer, members, recordMap, historyMap, overviewOptions),
    overviewOptions,
  );

  return {
    scope_label: getScopeLabel(viewer),
    selected_week_start: selectedWeekStart,
    detail_mode: overviewOptions.includeDetail ? "full" : "summary",
    weeks: recentWeeks(selectedWeekStart, 26).map((weekStart) => ({
      week_start_date: weekStart,
      label: weekStart,
    })),
    units,
  };
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
  if (!viewer.is_admin && viewer.role !== "preacher") {
    if (viewer.role === "district_leader") {
      query = query.eq("district_id", viewer.district_id || -1);
    } else if (viewer.role === "big_family_leader") {
      query = query.eq("big_family_id", viewer.big_family_id || -1);
    } else {
      return [];
    }
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return (data || []) as MemberRow[];
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
  memberIds: number[],
  anchorWeekStart: string,
) {
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
  const expectedWeekCounts = countHistoryWeeksByRange(weekRows, anchorWeekStart);
  applyHistoryExpectedCounts(historyMap, expectedWeekCounts);
  if (!weekIds.length) {
    return historyMap;
  }

  const weekStartById = new Map(weekRows.map((item) => [item.id, String(item.week_start_date)]));
  const { data: records, error: recordError } = await db
    .from("attendance_records")
    .select("member_id, attendance_week_id, event_type, status")
    .in("attendance_week_id", weekIds)
    .in("member_id", memberIds);
  if (recordError) {
    throw new Error(recordError.message);
  }

  for (const record of records || []) {
    const memberHistory = historyMap.get(record.member_id);
    const weekStart = weekStartById.get(record.attendance_week_id);
    if (!memberHistory || !weekStart) {
      continue;
    }

    for (const range of HISTORY_RANGES) {
      const startDate = memberHistory[range.key]?.start_date;
      if (startDate && weekStart >= startDate && weekStart <= anchorWeekStart) {
        addHistoryRecord(memberHistory[range.key], record.event_type, record.status);
      }
    }
  }

  finalizeHistoryUnknownCounts(historyMap);
  return historyMap;
}

function createEmptyHistoryMap(memberIds: number[], anchorWeekStart: string) {
  return new Map(memberIds.map((memberId) => [memberId, createEmptyHistorySummary(anchorWeekStart)]));
}

async function buildUnits(
  db: ReturnType<typeof createAdminClient>,
  viewer: MemberRow,
  members: MemberRow[],
  recordMap: Map<string, any>,
  historyMap: Map<number, Record<string, any>>,
  options: OverviewRequestOptions,
) {
  const units = [];
  const includeDistrict = viewer.is_admin || viewer.role === "preacher";
  const includeBig = includeDistrict || viewer.role === "district_leader";

  if (includeDistrict) {
    const districtIds = uniqueIds(members.map((member) => member.district_id));
    for (const district of (await loadByIds(db, "districts", districtIds)).sort(compareOrganizationRows)) {
      units.push(unit("district", district.id, district.name, null, members.filter((member) => member.district_id === district.id), recordMap, historyMap, options));
    }
  }

  const districtsById = new Map(
    (await loadByIds(db, "districts", uniqueIds(members.map((member) => member.district_id))))
      .map((district) => [district.id, district]),
  );
  const bigFamiliesById = new Map(
    (await loadByIds(db, "big_families", uniqueIds(members.map((member) => member.big_family_id))))
      .map((bigFamily) => [bigFamily.id, bigFamily]),
  );

  if (includeBig) {
    const bigIds = uniqueIds(members.map((member) => member.big_family_id));
    for (const big of (await loadByIds(db, "big_families", bigIds)).sort(compareOrganizationRows)) {
      const parentName = districtsById.get(big.district_id)?.name || null;
      units.push(unit("big_family", big.id, big.name, parentName, members.filter((member) => member.big_family_id === big.id), recordMap, historyMap, options));
    }
  }

  const smallIds = uniqueIds(members.map((member) => member.small_group_id));
  for (const small of (await loadByIds(db, "small_groups", smallIds)).sort(compareOrganizationRows)) {
    const parents = [
      bigFamiliesById.get(small.big_family_id)?.name,
      districtsById.get(small.district_id)?.name,
    ].filter(Boolean);
    units.push(unit("small_group", small.id, small.name, parents.join(" / ") || null, members.filter((member) => member.small_group_id === small.id), recordMap, historyMap, options));
  }

  return units.filter((item) => item.member_count > 0);
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
) {
  const result: Record<string, any> = {
    type,
    level: type,
    id,
    name,
    parent_name: parentName,
    member_count: members.length,
    stats: {
      sunday_service: stats(members, recordMap, "sunday_service"),
      small_group_fellowship: stats(members, recordMap, "small_group_fellowship"),
    },
  };

  if (options.includeHistory) {
    result.history = aggregateUnitHistory(members, historyMap);
  }
  if (options.includeDetail) {
    result.detail = {
      sunday_service: detail(members, recordMap, "sunday_service", historyMap),
      small_group_fellowship: detail(members, recordMap, "small_group_fellowship", historyMap),
    };
  }
  return result;
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
  const firstHistory = members
    .map((member) => historyMap.get(member.id))
    .find(Boolean);
  const anchorWeekStart = firstHistory?.month?.end_date || formatDate(new Date());
  const result = createEmptyHistorySummary(anchorWeekStart);

  for (const member of members) {
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

function stats(members: MemberRow[], recordMap: Map<string, any>, eventType: string) {
  const result = {
    present_count: 0,
    absent_count: 0,
    unknown_count: 0,
    confirmed_count: 0,
    expected_count: members.length,
  };
  for (const member of members) {
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
  return result;
}

function detail(
  members: MemberRow[],
  recordMap: Map<string, any>,
  eventType: string,
  historyMap: Map<number, Record<string, any>>,
) {
  const result: Record<string, any[]> = { present: [], absent: [], unknown: [] };
  for (const member of members) {
    const record = recordMap.get(`${member.id}:${eventType}`);
    const status = normalizeStatus(record?.status);
    result[status].push({
      id: member.id,
      full_name: member.full_name,
      role: member.role,
      gender: member.gender,
      note: String(record?.note || "").trim(),
      note_priority_high: Boolean(record?.note && record?.note_priority_high),
      history: historyMap.get(member.id) || createEmptyHistorySummary(formatDate(new Date())),
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

function countHistoryWeeksByRange(weekRows: any[], anchorWeekStart: string) {
  return Object.fromEntries(
    HISTORY_RANGES.map((range) => {
      const startDate = range.key === "month"
        ? getMonthStart(anchorWeekStart)
        : getDateWeeksBefore(anchorWeekStart, range.weeksBack);
      const count = weekRows.filter((week) => {
        const weekStart = String(week.week_start_date);
        return weekStart >= startDate && weekStart <= anchorWeekStart;
      }).length;
      return [range.key, count];
    }),
  );
}

function applyHistoryExpectedCounts(
  historyMap: Map<number, Record<string, any>>,
  expectedWeekCounts: Record<string, number>,
) {
  for (const memberHistory of historyMap.values()) {
    for (const range of HISTORY_RANGES) {
      const expectedCount = Number(expectedWeekCounts[range.key] || 0);
      for (const eventType of ["sunday_service", "small_group_fellowship"]) {
        if (memberHistory[range.key]?.[eventType]) {
          memberHistory[range.key][eventType].expected_count = expectedCount;
        }
      }
    }
  }
}

function finalizeHistoryUnknownCounts(historyMap: Map<number, Record<string, any>>) {
  for (const memberHistory of historyMap.values()) {
    for (const range of HISTORY_RANGES) {
      for (const eventType of ["sunday_service", "small_group_fellowship"]) {
        const stats = memberHistory[range.key]?.[eventType];
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
  const status = String(value || "unknown");
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
  if (viewer.is_admin || viewer.role === "preacher") {
    return "全部牧區";
  }
  if (viewer.role === "district_leader") {
    return viewer.district_name ? `${viewer.district_name} 轄區` : "所屬區";
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
