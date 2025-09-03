import type { AuthenticatedRequest, OAuthTokenResponse } from "../types/data-types.js";
import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const {
  JWT_SECRET = "",
} = process.env;

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }
  
  const token = authHeader.split(' ')[1];

  try {
    if(!token){
        throw new Error("Token Not Found");
    }
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  }
  catch {
    res.status(401).json({ error: 'Missing or Invalid token' });
  }
}

export function generateJwt(claims: Record<string, unknown>, tokenSet: OAuthTokenResponse){
    if(!JWT_SECRET){
        throw new Error('Missing JWT Secret');
    }
    return jwt.sign(
    { sub: claims?.sub, claims, providerTokens: tokenSet },
    JWT_SECRET,
    { expiresIn: '1h' }
  )
}
