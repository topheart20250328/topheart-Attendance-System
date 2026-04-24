import { createClient } from "jsr:@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, content-type, x-pending-token, x-client-info, apikey",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

export const LOGIN_ENABLED_ROLES = new Set([
  "district_leader",
  "big_family_leader",
  "small_group_leader",
]);

export type MemberDirectoryRow = {
  id: number;
  full_name: string;
  birthday: string | null;
  gender: "brother" | "sister" | null;
  note: string;
  role:
    | "district_leader"
    | "big_family_leader"
    | "small_group_leader"
    | "member"
    | "best";
  is_admin: boolean;
  line_user_id: string | null;
  is_active: boolean;
  last_line_login_at: string | null;
  district_id: number | null;
  district_name: string | null;
  big_family_id: number | null;
  big_family_name: string | null;
  small_group_id: number | null;
  small_group_name: string | null;
  created_at: string;
  updated_at: string;
};

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

export function redirectWithHash(
  redirectTo: string,
  params: Record<string, string>,
  status = 302,
) {
  const url = new URL(redirectTo);
  url.hash = new URLSearchParams(params).toString();

  return new Response(null, {
    status,
    headers: {
      Location: url.toString(),
    },
  });
}

export function getRequiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function createAdminClient() {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function normalizeProjectUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export function getLineCallbackUrl() {
  return `${normalizeProjectUrl(getRequiredEnv("SUPABASE_URL"))}/functions/v1/line-login-callback`;
}

export function getAllowedFrontendUrl() {
  const value = Deno.env.get("APP_FRONTEND_URL");
  return value ? normalizeProjectUrl(value) : null;
}

export function isAllowedRedirectTo(value: string) {
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    return false;
  }

  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
    return true;
  }

  const allowedFrontendUrl = getAllowedFrontendUrl();
  if (!allowedFrontendUrl) {
    return false;
  }

  return url.origin === new URL(allowedFrontendUrl).origin;
}

export function resolveRedirectTo(value: string | null) {
  if (value) {
    const candidate = normalizeProjectUrl(value);
    if (isAllowedRedirectTo(candidate)) {
      return candidate;
    }
  }

  const allowedFrontendUrl = getAllowedFrontendUrl();
  if (allowedFrontendUrl) {
    return allowedFrontendUrl;
  }

  throw new Error(
    "redirect_to is not allowed. Set APP_FRONTEND_URL for production domains.",
  );
}

export function randomUrlSafeToken(byteLength = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return base64UrlEncode(bytes);
}

export async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256Base64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return base64UrlEncode(new Uint8Array(digest));
}

export function base64UrlEncode(value: Uint8Array) {
  const binary = String.fromCharCode(...value);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

export function extractBearerToken(headers: Headers) {
  const authorization = headers.get("Authorization");
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");
  if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
    return null;
  }

  return token.trim();
}

export function extractPendingToken(headers: Headers) {
  return headers.get("X-Pending-Token")?.trim() || null;
}

export function getMondayIso(source: Date | string) {
  const date =
    source instanceof Date ? new Date(source) : parseIsoDate(String(source));
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return formatDate(date);
}

export function parseIsoDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map((value) => Number(value));
  return new Date(year, month - 1, day);
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function buildWeekLabel(weekStartIso: string) {
  const start = parseIsoDate(weekStartIso);
  return `${formatDate(start)}`;
}

export function isLoginEnabledMember(member: {
  role: string;
  is_admin: boolean;
  is_active: boolean;
}) {
  return member.is_active && (member.is_admin || LOGIN_ENABLED_ROLES.has(member.role));
}

export async function issueAppSession(
  adminClient: ReturnType<typeof createAdminClient>,
  member: { id: number; line_user_id: string | null },
) {
  if (!member.line_user_id) {
    throw new Error("Cannot issue app session without line_user_id.");
  }

  const rawToken = randomUrlSafeToken(32);
  const tokenHash = await sha256Hex(rawToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();

  const { error } = await adminClient.from("app_sessions").insert({
    token_hash: tokenHash,
    member_id: member.id,
    line_user_id: member.line_user_id,
    expires_at: expiresAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    appToken: rawToken,
    expiresAt,
  };
}

export async function cleanupExpiredAuthArtifacts(
  adminClient: ReturnType<typeof createAdminClient>,
) {
  const nowIso = new Date().toISOString();

  await adminClient
    .from("line_auth_states")
    .delete()
    .lt("expires_at", nowIso);

  await adminClient
    .from("line_pending_logins")
    .delete()
    .lt("expires_at", nowIso);

  await adminClient
    .from("app_sessions")
    .update({ revoked_at: nowIso })
    .lt("expires_at", nowIso)
    .is("revoked_at", null);
}
