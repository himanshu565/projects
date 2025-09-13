import "dotenv/config";
import fetch from "node-fetch";
import type { Request, Response } from "express";
import { generateRandomBase64Url, sha256Base64Url } from "../util/crypt.js";
import type { OAuthTokenResponse } from "../../types/dataTypes.js";
import { generateJwt } from "../util/jwt-utils.js";
import { db } from "../index.js";
import { usersTable, type User } from "../db/schemas/users.js";
import { eq } from "drizzle-orm";

const {
  BASE_URL,
  OAUTH_AUTHORIZATION_URL,
  OAUTH_TOKEN_URL,
  OAUTH_USERINFO_URL,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_SCOPE = "openid profile email",
} = process.env;

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const state = generateRandomBase64Url(16);
  const codeVerifier = generateRandomBase64Url(64);
  const codeChallenge = await sha256Base64Url(codeVerifier);

  res.cookie("pkce", JSON.stringify({ codeVerifier, state }), {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true in prod over HTTPS
    maxAge: 5 * 60 * 1000, // 5 minutes
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: OAUTH_CLIENT_ID!,
    response_type: "code",
    redirect_uri: `http://localhost:5173/callback`,
    scope: OAUTH_SCOPE,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  res.status(200).json({ authUrl: `${OAUTH_AUTHORIZATION_URL}?${params}` });
}

export async function OAuthCallback(
  req: Request,
  res: Response
): Promise<void> {
  const code = req.query.code as string;
  const state = req.query.state as string;
  const pkceCookie = req.cookies.pkce;

  if (!code || !state) {
    res.status(400).send("Missing code or state");
    return;
  }

  if (!pkceCookie) {
    res.status(400).send("Missing cookies");
    return;
  }

  const { codeVerifier, state: storedState } = JSON.parse(pkceCookie);

  if (state !== storedState) {
    res.status(400).send("Invalid state");
    return;
  }

  const tokenResp = await fetchOAuthToken(code, codeVerifier);

  if (!tokenResp.ok) {
    res.status(400).send(await tokenResp.text());
    return;
  }

  const tokenSet = (await tokenResp.json()) as OAuthTokenResponse;

  const claims = await fetchOAuthUserInfo(tokenSet);

  if (!claims) {
    res.status(500).send("Unable to generate claims");
    return;
  }

  // TODO: need to create db service layer for other services
  const fetchUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, claims.email));
  if (fetchUser.length === 0) {
    const newUser: User = {
      firstName: claims.given_name as string,
      lastName: claims.family_name as string,
      email: claims.email as string,
    };

    await db.insert(usersTable).values(newUser);
  }

  try {
    const appJwt: string = generateJwt(claims, tokenSet);
    res.clearCookie("pkce");
    res.json({ jwt: appJwt });
  } catch {
    res.status(500).send("Error Generating Jwt Token");
  }
}

// TODO: declare return type
async function fetchOAuthToken(code: string, codeVerifier: string) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: String(code),
    redirect_uri: `http://localhost:5173/callback`,
    client_id: OAUTH_CLIENT_ID!,
    code_verifier: codeVerifier,
  });

  if (OAUTH_CLIENT_SECRET) {
    body.set("client_secret", OAUTH_CLIENT_SECRET);
  }

  const tokenResp = await fetch(OAUTH_TOKEN_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  return tokenResp;
}

async function fetchOAuthUserInfo(
  tokenSet: OAuthTokenResponse
): Promise<Record<string, unknown> | null> {
  let claims: Record<string, unknown> | null = null;
  if (OAUTH_USERINFO_URL && tokenSet.access_token) {
    const uiResp = await fetch(OAUTH_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenSet.access_token}` },
    });

    if (uiResp.ok) {
      claims = (await uiResp.json()) as Record<string, unknown>;
    }
  }

  return claims;
}
