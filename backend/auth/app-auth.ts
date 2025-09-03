import 'dotenv/config';
import fetch from 'node-fetch';
import type { Request, Response } from 'express';
import { generateRandomBase64Url, sha256Base64Url } from '../util/crypt.js';
import type { OAuthTokenResponse } from '../types/data-types.js';
import { PORT } from '../index.js';
import { generateJwt } from '../util/jwt-utils.js';

const {
  BASE_URL = `http://localhost:${PORT}`,
  OAUTH_AUTHORIZATION_URL,
  OAUTH_TOKEN_URL,
  OAUTH_USERINFO_URL,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_SCOPE = 'openid profile email',
} = process.env;

export async function loginHandler(req: Request, res: Response){
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
    redirect_uri: `${BASE_URL}/auth/callback`,
    scope: OAUTH_SCOPE,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256"
  });

  res.redirect(`${OAUTH_AUTHORIZATION_URL}?${params}`);
}

export async function OAuthCallback(req: Request, res: Response){
  const { code, state } = req.query;
  const pkceCookie = req.cookies.pkce;

  if (!code || !state) {
    return res.status(400).json({ error: 'Missing code or state' });
  }

  if(!pkceCookie){
    return res.status(400).json({error: 'Missing cookies'});
  }

  const { codeVerifier, state: storedState } = JSON.parse(pkceCookie);

  if(state !== storedState){
      return res.status(400).json({error: "Invalid state"});
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: String(code),
    redirect_uri: `${BASE_URL}/auth/callback`,
    client_id: OAUTH_CLIENT_ID!,
    code_verifier: codeVerifier,
  });


  if (OAUTH_CLIENT_SECRET) {
    body.set('client_secret', OAUTH_CLIENT_SECRET);
  }

  const tokenResp = await fetch(OAUTH_TOKEN_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!tokenResp.ok) {
    return res.status(400).json({ error: await tokenResp.text() });
  }

  const tokenSet = (await tokenResp.json()) as OAuthTokenResponse;

  let claims: Record<string, unknown> | null = null;
  if (OAUTH_USERINFO_URL && tokenSet.access_token) {
    const uiResp = await fetch(OAUTH_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenSet.access_token}` },
    });
    if (uiResp.ok) claims = await uiResp.json() as Record<string, unknown>;
  }

  if(!claims){
      return res.status(500).json({ error: "Unable to generate claims"})
  }
  try{
    const appJwt: string = generateJwt(claims, tokenSet);
    res.clearCookie('pkce');
    res.json({ jwt: appJwt });

  } catch{
      return res.status(500).json({ error: "Error Generating Jwt Token"});
  }

}
