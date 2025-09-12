import type { JwtState, OAuthTokenResponse } from "../../types/dataTypes.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const {
  JWT_SECRET
} = process.env;

export function verifyJwt(token: string) : JwtState {
  try {
    if(!JWT_SECRET){
        throw Error("Secret not defined");
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    return { 
        valid: true, 
        expired: false, 
        decoded 
    };
  }
  catch (error: any) {
      return { 
          valid: false, 
          expired: error.name === "TokenExpiredError",
          decoded: "",
      }
  }
}

export function generateJwt(claims: Record<string, unknown>, tokenSet: OAuthTokenResponse) : string {
    if(!JWT_SECRET){
        throw new Error('Missing JWT Secret');
    }
    return jwt.sign(
    { sub: claims?.sub, claims, providerTokens: tokenSet },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}
