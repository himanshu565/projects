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
import { TRPCError } from "@trpc/server";
import { generateUniquePublicId } from "../util/crypt.js";
import { randomUUID } from "node:crypto";
import { invitesTable, type Invite } from "../db/schemas/invite.js";
import { generateInviteLink } from "../util/invite-utils.js";

export const teamRouter = router({
    getTeamDetails: 
        publicProcedure.input(z.object({ teamid: z.string() }))
        .query(async (opts): Promise<TeamPageDetails> => {
            const { ctx, input } = opts;

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

            if(teamDetails.length === 0){
                throw new TRPCError({ 
                    code: "FORBIDDEN",
                    message: "You do not have access to this team or it does not exist."
                });
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

    createTeam:
        publicProcedure.input(z.object({
            name: z.string(),
            desc: z.string(),
        }))
        .mutation(async (opts): Promise<void> => {
            const { input, ctx } = opts;

            const newTeamPublicId = generateUniquePublicId();
            const newTeam: Team = {
                publicId: newTeamPublicId,
                teamName: input.name,
                teamDesc: input.desc,
                ownerId: ctx.user.id,
            };

            await ctx.db.insert(teamsTable).values(newTeam);

            const newTeamId = await ctx.db.select({
                id: teamsTable.id,
            })
            .from(teamsTable)
            .where(eq(teamsTable.publicId, newTeamPublicId));

            if(newTeamId[0] === undefined){
                throw new TRPCError({ 
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create team. Please try again."
                });
            }

            const newUserTeamMapping: UserTeamMapping = {
                userId: ctx.user.id,
                teamId: newTeamId[0].id,
                addUserPerm: true,
                addDocPerm: true,
                removeDocPerm: true,
                removeUserPerm: true,
                deleteTeamPerm: true,
                updateTeamPerm: true,
            }

            await ctx.db.insert(userTeamJunctionTable).values(newUserTeamMapping);
        }),

    deleteTeam:
        publicProcedure.input(z.object({
            publicId: z.string()
        }))
        .mutation(async (opts): Promise<void> => {
            const { input, ctx } = opts;
            
            const teamId = await ctx.db.select({
                id: teamsTable.id
            })
            .from(teamsTable)
            .where(eq(teamsTable.publicId, input.publicId));

            if(teamId[0] === undefined){
                throw new TRPCError({ 
                    code: "NOT_FOUND",
                    message: "Team not found."
                });
            }
            
            const userDeletePerms = await ctx.db.select({
                deleteTeamPerm: userTeamJunctionTable.deleteTeamPerm,  
            })
            .from(userTeamJunctionTable)
            .where(and(
                eq(userTeamJunctionTable.userId, ctx.user.id),
                eq(userTeamJunctionTable.teamId, teamId[0].id),
            ));

            if(userDeletePerms[0] === undefined || !(userDeletePerms[0].deleteTeamPerm)){
                throw new TRPCError({ 
                    code: "FORBIDDEN",
                    message: "You do not have permission to delete this team."
                });
            }

            await ctx.db.delete(teamsTable).where(eq(teamsTable.publicId, input.publicId));
        }),

    generateInviteLink:
        publicProcedure.input(z.object({
            teamId: z.string(),
        }))
        .query(async (opts): Promise<string> => {
            const { input, ctx } = opts;

            const team = await ctx.db.select({
                id: teamsTable.id,
            })
                .from(teamsTable)
                .where(eq(teamsTable.publicId, input.teamId));

            if (team[0] === undefined) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Team not found."
                });
            }

            const userAddUserPerms = await ctx.db.select({
                addUserPerm: userTeamJunctionTable.addUserPerm,
            })
            .from(userTeamJunctionTable)
            .where(and(
                eq(userTeamJunctionTable.userId, ctx.user.id),
                eq(userTeamJunctionTable.teamId, team[0].id),
            ));

            if(userAddUserPerms[0] === undefined || !(userAddUserPerms[0].addUserPerm)){
                throw new TRPCError({ 
                    code: "FORBIDDEN",
                    message: "You do not have permission to invite users to this team."
                });
            }

            const inviteLink: string = await generateInviteLink(team[0].id, ctx.user.id);

            return inviteLink;
        }),

});
