import {
  cleanupExpiredAuthArtifacts,
  createAdminClient,
  getLineCallbackUrl,
  getRequiredEnv,
  isLoginEnabledMember,
  issueAppSession,
  jsonResponse,
  redirectWithHash,
  sha256Hex,
} from "../_shared/common.ts";

type AuthStateRow = {
  id: string;
  state: string;
  code_verifier: string;
  nonce: string;
  redirect_to: string;
  expires_at: string;
  used_at: string | null;
};

type LineTokenResponse = {
  access_token?: string;
  id_token?: string;
  scope?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

type LineVerifyResponse = {
  sub: string;
  name?: string;
  picture?: string;
  email?: string;
  nonce?: string;
};

type LineUserInfoResponse = {
  sub: string;
  name?: string;
  picture?: string;
  email?: string;
};

function getPendingAuthNotice(member: {
  role: string;
  is_admin: boolean;
  is_active: boolean;
} | null) {
  if (!member) {
    return "請輸入邀請碼完成第一次 LINE 綁定。";
  }

  if (!member.is_active) {
    return "此 LINE 帳號目前綁定在已停用人員，請輸入正確領袖邀請碼完成轉綁。";
  }

  return "此 LINE 帳號已綁定，但目前沒有登入權限，請輸入正確領袖邀請碼完成轉綁。";
}

async function exchangeCodeForToken(args: {
  code: string;
  codeVerifier: string;
}) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: args.code,
    redirect_uri: getLineCallbackUrl(),
    client_id: getRequiredEnv("LINE_CHANNEL_ID"),
    client_secret: getRequiredEnv("LINE_CHANNEL_SECRET"),
    code_verifier: args.codeVerifier,
  });

  const response = await fetch("https://api.line.me/oauth2/v2.1/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = (await response.json().catch(() => null)) as LineTokenResponse | null;
  if (!response.ok || !data?.access_token || !data?.id_token) {
    throw new Error(
      data?.error_description || data?.error || "LINE token exchange failed.",
    );
  }

  return data;
}

async function verifyIdToken(args: { idToken: string; nonce: string }) {
  const body = new URLSearchParams({
    id_token: args.idToken,
    client_id: getRequiredEnv("LINE_CHANNEL_ID"),
    nonce: args.nonce,
  });

  const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = (await response.json().catch(() => null)) as LineVerifyResponse | null;
  if (!response.ok || !data?.sub) {
    throw new Error("LINE id_token verification failed.");
  }

  return data;
}

async function fetchUserInfo(accessToken: string) {
  const response = await fetch("https://api.line.me/oauth2/v2.1/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json().catch(() => null)) as LineUserInfoResponse | null;
  return data?.sub ? data : null;
}

Deno.serve(async (request) => {
  const url = new URL(request.url);
  const state = url.searchParams.get("state");

  if (!state) {
    return jsonResponse({ error: "Missing LINE login state." }, 400);
  }

  try {
    const adminClient = createAdminClient();
    await cleanupExpiredAuthArtifacts(adminClient);

    const { data: authState, error: stateError } = await adminClient
      .from("line_auth_states")
      .select("*")
      .eq("state", state)
      .maybeSingle();

    if (stateError || !authState) {
      return jsonResponse({ error: "Invalid or expired LINE login state." }, 400);
    }

    const stateRow = authState as AuthStateRow;
    const redirectTo = stateRow.redirect_to;

    if (stateRow.used_at) {
      return redirectWithHash(redirectTo, {
        auth_error: "這個 LINE 登入連結已被使用，請重新登入。",
      });
    }

    if (new Date(stateRow.expires_at).getTime() < Date.now()) {
      return redirectWithHash(redirectTo, {
        auth_error: "LINE 登入逾時，請重新登入。",
      });
    }

    await adminClient
      .from("line_auth_states")
      .update({ used_at: new Date().toISOString() })
      .eq("id", stateRow.id)
      .is("used_at", null);

    const lineError = url.searchParams.get("error");
    if (lineError) {
      const description =
        url.searchParams.get("error_description") || "LINE 登入被取消或失敗。";
      return redirectWithHash(redirectTo, {
        auth_error: description,
      });
    }

    const code = url.searchParams.get("code");
    if (!code) {
      return redirectWithHash(redirectTo, {
        auth_error: "LINE 沒有回傳授權碼。",
      });
    }

    const tokenResponse = await exchangeCodeForToken({
      code,
      codeVerifier: stateRow.code_verifier,
    });

    const verified = await verifyIdToken({
      idToken: tokenResponse.id_token!,
      nonce: stateRow.nonce,
    });

    const userInfo = await fetchUserInfo(tokenResponse.access_token!);
    const lineUserId = userInfo?.sub || verified.sub;
    const displayName = userInfo?.name || verified.name || "";
    const pictureUrl = userInfo?.picture || verified.picture || "";

    const { data: matchedMember, error: memberError } = await adminClient
      .from("members")
      .select("id, role, is_admin, is_active, line_user_id")
      .eq("line_user_id", lineUserId)
      .maybeSingle();

    if (memberError) {
      return redirectWithHash(redirectTo, {
        auth_error: memberError.message,
      });
    }

    if (matchedMember && isLoginEnabledMember(matchedMember)) {
      await adminClient
        .from("members")
        .update({ last_line_login_at: new Date().toISOString() })
        .eq("id", matchedMember.id);

      const session = await issueAppSession(adminClient, matchedMember);
      return redirectWithHash(redirectTo, {
        app_token: session.appToken,
      });
    }

    const pendingToken = crypto.randomUUID() + randomSuffix();
    const tokenHash = await sha256Hex(pendingToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 20).toISOString();

    await adminClient
      .from("line_pending_logins")
      .delete()
      .eq("line_user_id", lineUserId)
      .is("consumed_at", null);

    const { error: pendingError } = await adminClient
      .from("line_pending_logins")
      .insert({
        token_hash: tokenHash,
        line_user_id: lineUserId,
        display_name: displayName,
        picture_url: pictureUrl,
        redirect_to: redirectTo,
        expires_at: expiresAt,
      });

    if (pendingError) {
      return redirectWithHash(redirectTo, {
        auth_error: pendingError.message,
      });
    }

    return redirectWithHash(redirectTo, {
      pending_token: pendingToken,
      auth_notice: getPendingAuthNotice(matchedMember),
    });
  } catch (error) {
    console.error(error);
    const fallbackUrl = Deno.env.get("APP_FRONTEND_URL");
    if (fallbackUrl) {
      return redirectWithHash(fallbackUrl, {
        auth_error:
          error instanceof Error ? error.message : "LINE 登入發生未知錯誤。",
      });
    }

    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "Unexpected error.",
      },
      500,
    );
  }
});

function randomSuffix() {
  return crypto.randomUUID().replaceAll("-", "");
}
