import { eq } from "drizzle-orm";
import { userTeamJunctionTable } from "../db/schemas/teamUserJunction.js";
import { publicProcedure, router } from "./trpc.js";
import { z } from 'zod';
import { teamsTable } from "../db/schemas/teams.js";

export const teamRouter = router({
    getTeams: 
        publicProcedure
        .query((opts) => {
            const { ctx } = opts;
            
            const teams = ctx.db.select({ 
                teamId: teamsTable.id,
                name: teamsTable.teamName,
                desc: teamsTable.teamDesc,
                owner: teamsTable.ownerId,
            })
            .from(userTeamJunctionTable)
            .innerJoin(teamsTable, eq(userTeamJunctionTable.teamId, teamsTable.id))
            .where(eq(teamsTable.id, ctx.user));

            return teams;
        }),
    getTeam: 
        publicProcedure.input(
            z.object({
                userId: z.string(), 
                teamId: z.string()
            })
        )
        .query((opts) => {
            //TODO: Should fetch team details: name, collaborators, owner, files etc. 
            return {
            };
        }),
});
