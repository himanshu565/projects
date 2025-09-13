import { eq, and, inArray } from "drizzle-orm";
import { userTeamJunctionTable } from "../db/schemas/teamUserJunction.js";
import { publicProcedure, router } from "./trpc.js";
import { z } from 'zod';
import { teamsTable } from "../db/schemas/teams.js";
import { usersTable } from "../db/schemas/users.js";
import type { TeamCardDetails, TeamPageDetails } from "../../types/dataTypes.js";
import { docsTable } from "../db/schemas/docs.js";
import { teamDocJunctionTable } from "../db/schemas/teamDocJunction.js";

export const teamRouter = router({
    getTeams: 
        publicProcedure
        .query(async (opts): Promise<TeamCardDetails[]> => {
            const { ctx } = opts;
            
            const out: TeamCardDetails[] = await ctx.db.select({ 
                teamId: teamsTable.id,
                name: teamsTable.teamName,
                desc: teamsTable.teamDesc,
                ownerId: teamsTable.ownerId,
                ownerFirstName: usersTable.firstName,
                ownerLastName: usersTable.lastName,
            })
            .from(userTeamJunctionTable)
            .innerJoin(teamsTable, eq(userTeamJunctionTable.teamId, teamsTable.id))
            .innerJoin(usersTable, eq(userTeamJunctionTable.userId, usersTable.id))
            .where(eq(userTeamJunctionTable.userId, ctx.user));

            return out;
        }),
    getTeam: 
        publicProcedure.input(z.number())
        .query(async (opts): Promise<TeamPageDetails> => {
            
            const { ctx, input } = opts;

            const teamDetails = await ctx.db.select({ 
                teamId: teamsTable.id,
                name: teamsTable.teamName,
                desc: teamsTable.teamDesc,
                owner: teamsTable.ownerId,
            })
            .from(userTeamJunctionTable)
            .innerJoin(teamsTable, eq(userTeamJunctionTable.teamId, teamsTable.id))
            .where(and(
                eq(userTeamJunctionTable.userId, ctx.user),
                eq(userTeamJunctionTable.teamId, input.valueOf())
            ));

            // fetch collaborators
            const userDetails = await ctx.db.select({ 
                userId: usersTable.id,
                firstName: usersTable.firstName,
                lastName: usersTable.lastName,
            })
            .from(userTeamJunctionTable)
            .innerJoin(usersTable, eq(userTeamJunctionTable.userId, usersTable.id))
            .where(eq(userTeamJunctionTable.teamId, input.valueOf()));

            let ownerFirstName: string | null = null;
            let ownerLastName: string | null = null;
            for(const user of userDetails){
                if(user.userId === teamDetails[0]?.owner){
                    ownerFirstName = user.firstName;
                    ownerLastName = user.lastName;
                    break;
                }
            }

            // fetch team docs metadata
            const docDetails = await ctx.db.select({
                docId: docsTable.id,
                name: docsTable.name,
            })
            .from(teamDocJunctionTable)
            .innerJoin(docsTable, eq(teamDocJunctionTable.docId, docsTable.id))
            .where(eq(teamDocJunctionTable.teamId, input.valueOf()));

            const out: TeamPageDetails = {
                teamId: teamDetails[0]?.teamId,
                name: teamDetails[0]?.name,
                desc: teamDetails[0]?.desc,
                ownerId: teamDetails[0]?.owner,
                ownerFirstName: ownerFirstName,
                ownerLastName: ownerLastName,
                collaborators: userDetails,
                docs: docDetails,
            }
            
            return out;
        }),
});
