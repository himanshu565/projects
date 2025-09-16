import { eq, and } from "drizzle-orm";
import { userTeamJunctionTable } from "../db/schemas/teamUserJunction.js";
import type { UserTeamMapping } from "../db/schemas/teamUserJunction.js";
import { publicProcedure, router } from "./trpc.js";
import { z } from 'zod';
import { teamsTable } from "../db/schemas/teams.js";
import type { Team } from "../db/schemas/teams.js";
import { usersTable } from "../db/schemas/users.js";
import type { TeamCardDetails, TeamPageDetails } from "../../types/dataTypes.js";
import { docsTable } from "../db/schemas/docs.js";
import { teamDocJunctionTable } from "../db/schemas/teamDocJunction.js";
import { TRPCError, type inferProcedureBuilderResolverOptions } from "@trpc/server";
import { generateUniquePublicId } from "../util/crypt.js";

export const teamRouter = router({
    getTeams: 
        publicProcedure
        .query(async (opts): Promise<TeamCardDetails[]> => {
            const { ctx } = opts;

            console.log(ctx.user.id);

            const out: TeamCardDetails[] = await ctx.db.select({ 
                teamId: teamsTable.publicId,
                name: teamsTable.teamName,
                desc: teamsTable.teamDesc,
                ownerId: usersTable.publicId,
                ownerFirstName: usersTable.firstName,
                ownerLastName: usersTable.lastName,
            })
            .from(userTeamJunctionTable)
            .innerJoin(teamsTable, eq(userTeamJunctionTable.teamId, teamsTable.id))
            .innerJoin(usersTable, eq(teamsTable.ownerId, usersTable.id))
            .where(eq(userTeamJunctionTable.userId, ctx.user.id));

            return out;
        }),
    getTeam: 
        publicProcedure.input(z.object({ teamid: z.string() }))
        .query(async (opts): Promise<TeamPageDetails> => {
            const { ctx, input } = opts;

            console.log(ctx.user.id);

            const teamDetails = await ctx.db.select({ 
                teamId: teamsTable.publicId,
                name: teamsTable.teamName,
                desc: teamsTable.teamDesc,
                owner: usersTable.id,
            })
            .from(userTeamJunctionTable)
            .innerJoin(teamsTable, eq(userTeamJunctionTable.teamId, teamsTable.id))
            .innerJoin(usersTable, eq(teamsTable.ownerId, usersTable.id))
            .where(and(
                eq(userTeamJunctionTable.userId, ctx.user.id),
                eq(teamsTable.publicId, input.teamid),
            ));

            console.log(teamDetails);

            if(teamDetails.length === 0){
                throw new TRPCError({ code: "FORBIDDEN" });
            }

            // fetch collaborators
            const userDetails = await ctx.db.select({ 
                userId: usersTable.publicId,
                firstName: usersTable.firstName,
                lastName: usersTable.lastName,
            })
            .from(userTeamJunctionTable)
            .innerJoin(teamsTable, eq(userTeamJunctionTable.teamId, teamsTable.id))
            .innerJoin(usersTable, eq(userTeamJunctionTable.userId, usersTable.id))
            .where(eq(teamsTable.publicId, input.teamid));

            // fetch owner details
            const ownerDetails = await ctx.db.select({
                ownerId: usersTable.publicId,
                ownerFirstName: usersTable.firstName,
                ownerLastName: usersTable.lastName,
            })
            .from(usersTable)
            .where(eq(usersTable.id, teamDetails[0]?.owner))

            // fetch team docs metadata
            const docDetails = await ctx.db.select({
                docId: docsTable.publicId,
                name: docsTable.name,
            })
            .from(teamDocJunctionTable)
            .innerJoin(teamsTable, eq(teamDocJunctionTable.teamId, teamsTable.id))
            .innerJoin(docsTable, eq(teamDocJunctionTable.docId, docsTable.id))
            .where(eq(teamsTable.publicId, input.teamid));

            const out: TeamPageDetails = {
                teamId: teamDetails[0]?.teamId,
                name: teamDetails[0]?.name,
                desc: teamDetails[0]?.desc,
                ownerId: ownerDetails[0]?.ownerId,
                ownerFirstName: ownerDetails[0]?.ownerFirstName,
                ownerLastName: ownerDetails[0]?.ownerLastName,
                collaborators: userDetails,
                docs: docDetails,
            }
            
            return out;
        }),
});
