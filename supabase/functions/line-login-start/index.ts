import {
  cleanupExpiredAuthArtifacts,
  corsHeaders,
  createAdminClient,
  getLineCallbackUrl,
  getRequiredEnv,
  jsonResponse,
  randomUrlSafeToken,
  resolveRedirectTo,
  sha256Base64Url,
} from "../_shared/common.ts";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const adminClient = createAdminClient();
    await cleanupExpiredAuthArtifacts(adminClient);

    const url = new URL(request.url);
    const redirectTo = resolveRedirectTo(url.searchParams.get("redirect_to"));
    const lineChannelId = getRequiredEnv("LINE_CHANNEL_ID");
    const callbackUrl = getLineCallbackUrl();

    const state = randomUrlSafeToken(24);
    const nonce = randomUrlSafeToken(24);
    const codeVerifier = randomUrlSafeToken(64);
    const codeChallenge = await sha256Base64Url(codeVerifier);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10).toISOString();

    const { error } = await adminClient.from("line_auth_states").insert({
      state,
      code_verifier: codeVerifier,
      nonce,
      redirect_to: redirectTo,
      expires_at: expiresAt,
    });

    if (error) {
      return jsonResponse({ error: error.message }, 500);
    }

    const authorizationUrl = new URL(
      "https://access.line.me/oauth2/v2.1/authorize",
    );
    authorizationUrl.search = new URLSearchParams({
      response_type: "code",
      client_id: lineChannelId,
      redirect_uri: callbackUrl,
      state,
      scope: "openid profile",
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    }).toString();

    if (url.searchParams.get("mode") === "redirect") {
      return Response.redirect(authorizationUrl.toString(), 302);
    }

    return jsonResponse({
      authorization_url: authorizationUrl.toString(),
      callback_url: callbackUrl,
      redirect_to: redirectTo,
    });
  } catch (error) {
    console.error(error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Unexpected error." },
      500,
    );
  }
});
