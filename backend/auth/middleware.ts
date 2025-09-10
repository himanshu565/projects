import type { NextFunction, Request, Response } from "express";
import type { JwtState } from "../types/data-types.js";
import { verifyJwt } from "../util/jwt-utils.js";
import { db } from "../index.js";
import { usersTable } from "../db/schemas/users.js";
import { eq } from "drizzle-orm";

export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.header("Authorization");
    if(!authHeader){
        res.status(401).send('Missing Authorization Header');
        return;
    }

    const jwToken: string = authHeader.substring(7);
    if(!jwToken){
        res.status(401).send('Missing token');
        return;
    }

    const jwtState: JwtState = verifyJwt(jwToken);
    if(jwtState.expired){
        res.status(401).send('Expired token');
        return;
    }
    if(!jwtState.valid){
        res.status(401).send('Invalid token');
        return;
    }

    const decodedClaims: Record<string, unknown> | null  = jwtState.decoded.claims;
    if(!decodedClaims){
        res.status(401).send('Invalid token claim');
        return;
    }

    const email : string | unknown = decodedClaims.email;
    if(!email){
        res.status(401).send('Missing email');
        return;
    }

    const userDetails = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if(userDetails.length === 0){
        res.status(403).send('Unauthorized User');
        return;
    }

    next();
};
