import type { JwtState } from "../types/dataTypes.js";
import { verifyJwt } from "../util/jwt-utils.js";
import { db } from "../index.js";
import { usersTable } from "../db/schemas/users.js";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const jwtMiddleware = async (opts: any) => {
    const { ctx } = opts;
    const authHeader: string = ctx.req.header("Authorization");
    if(!authHeader){
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    const jwToken: string = authHeader.substring(7);
    if(!jwToken){
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    const jwtState: JwtState = verifyJwt(jwToken);
    if(jwtState.expired){
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }
    if(!jwtState.valid){
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    const decodedClaims: Record<string, unknown> | null  = jwtState.decoded.claims;
    if(!decodedClaims){
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    const email : string | unknown = decodedClaims.email;
    if(!email){
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    const userDetails = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if(userDetails.length === 0){
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return opts.next({
        ctx: {
            user: userDetails[0]?.id, 
        },
    });
};
