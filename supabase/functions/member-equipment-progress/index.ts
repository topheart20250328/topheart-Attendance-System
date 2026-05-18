import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-app-token, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

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
const PREACHER_ROLES = new Set(["preacher", "trainee_preacher"]);
const DISTRICT_PASTOR_ROLES = new Set(["district_pastor"]);
const DISTRICT_LEADER_ROLES = new Set(["district_leader"]);
const EQUIPMENT_PROGRESS_VALUES = new Set(["none", "growth", "disciple", "leader"]);
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

type MemberRow = {
  id: number;
  role: string;
  is_admin: boolean;
  is_active: boolean;
  district_id: number | null;
  district_pastor_district_ids?: number[] | null;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  try {
    const db = createAdminClient();
    const viewer = await getViewer(db, request.headers);
    if (!viewer) {
      return json({ error: "Unauthorized." }, 401);
    }

    const body = await request.json().catch(() => null);
    const effectiveViewer = getEffectiveViewer(
      viewer,
      isAdminModeEnabled(viewer, body?.admin_mode),
    );
    const memberId = toPositiveInt(body?.member_id);
    const equipmentProgress = normalizeEquipmentProgress(body?.equipment_progress);
    if (!memberId) {
      return json({ error: "member_id is required." }, 400);
    }

    const { data: target, error: targetError } = await db
      .from("member_directory")
      .select("id, role, is_admin, is_active, district_id, district_pastor_district_ids")
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

    const { data: updated, error: updateError } = await db
      .from("members")
      .update({ equipment_progress: equipmentProgress })
      .eq("id", memberId)
      .select("id, equipment_progress")
      .single();
    if (updateError) {
      return json({ error: updateError.message }, 500);
    }

    return json({ member: updated });
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
    .select("member_id")
    .eq("token_hash", tokenHash)
    .is("revoked_at", null)
    .gt("expires_at", nowIso)
    .maybeSingle();
  if (sessionError || !session) {
    return null;
  }

  const { data: member, error: memberError } = await db
    .from("member_directory")
    .select("id, role, is_admin, is_active, district_id, district_pastor_district_ids")
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

function canEditProfile(viewer: MemberRow, target: MemberRow) {
  if (viewer.is_admin || PREACHER_ROLES.has(viewer.role)) {
    return true;
  }
  return (
    canManageDistrict(viewer, target.district_id) &&
    canManageAttendanceTarget(viewer.role, target.role)
  );
}

function canManageDistrict(viewer: MemberRow, districtId: number | null) {
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

function canManageAttendanceTarget(viewerRole: string, targetRole: string) {
  const viewerOrder = ROLE_PERMISSION_TIER[viewerRole] || 99;
  const targetOrder = ROLE_PERMISSION_TIER[targetRole] || 99;
  return targetOrder >= viewerOrder && targetOrder < 99;
}

function getDistrictPastorDistrictIds(member: MemberRow) {
  return (member.district_pastor_district_ids || [])
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);
}

function normalizeEquipmentProgress(value: unknown) {
  const progress = String(value || "").trim();
  return EQUIPMENT_PROGRESS_VALUES.has(progress) ? progress : "none";
}

function toPositiveInt(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}
