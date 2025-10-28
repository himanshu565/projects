import { and, eq, inArray } from "drizzle-orm";

import type { InviteResponse, TeamCardDetails } from "../../types/dataTypes.js";
import { teamsTable } from "../db/schemas/teams.js";
import { userTeamJunctionTable } from "../db/schemas/teamUserJunction.js";
import { usersTable } from "../db/schemas/users.js";
import { publicProcedure, router } from "./trpc.js";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { generateInviteLink } from "../util/invite-utils.js";

export const userTeamRouter = router({
    getUserTeams:
        publicProcedure
        .query(async (opts): Promise<TeamCardDetails[]> => {
            const { ctx } = opts;

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
    
    removeUserFromTeam:
        publicProcedure.input(
            z.object({
                teamId: z.string(),
                userIds: z.array(z.string()), // Accept an array of user IDs
            })
        )
        .mutation(async (opts): Promise<void> => {
            const { input, ctx } = opts;

            const team = await ctx.db.select()
                .from(teamsTable)
                .where(eq(teamsTable.publicId, input.teamId));

            if (team.length === 0 || team[0] === undefined) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Team not found'
                });
            }

            // Check if the user has permission to remove users from the team
            const initiatorPerms = await ctx.db.select()
                .from(userTeamJunctionTable)
                .where(and(
                    eq(userTeamJunctionTable.teamId, team[0].id),
                    eq(userTeamJunctionTable.userId, ctx.user.id)
                ));

            if (initiatorPerms.length === 0 || initiatorPerms[0] === undefined || !initiatorPerms[0].removeUserPerm) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to remove users from this team'
                });
            }

            const userIds = await ctx.db.select({
                id: usersTable.id,
            })
                .from(usersTable)
                .where(inArray(usersTable.publicId, input.userIds));

            if (userIds.length === 0) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'No valid users found'
                });
            }

            // Perform batch deletion
            await ctx.db.delete(userTeamJunctionTable)
                .where(and(
                    eq(userTeamJunctionTable.teamId, team[0].id),
                    inArray(userTeamJunctionTable.userId, userIds.map(user => user.id))
                ));
        }),

    inviteUsersToTeam:
        publicProcedure.input(
            z.object({
                teamId: z.string(),
                userEmails: z.array(z.email()), 
            })
        )
        .mutation(async (opts): Promise<InviteResponse> => {
            const { input, ctx } = opts;

            // Validate the team
            const team = await ctx.db.select()
                .from(teamsTable)
                .where(eq(teamsTable.publicId, input.teamId));

            if (team.length === 0 || team[0] === undefined) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Team not found'
                });
            }

            // Check if the user has permission to invite others
            const initiatorPerms = await ctx.db.select()
                .from(userTeamJunctionTable)
                .where(and(
                    eq(userTeamJunctionTable.teamId, team[0].id),
                    eq(userTeamJunctionTable.userId, ctx.user.id)
                ));

            if (initiatorPerms.length === 0 || initiatorPerms[0] === undefined || !initiatorPerms[0].addUserPerm) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to invite users to this team'
                });
            }

            const inviteUrl = await generateInviteLink(team[0].id, ctx.user.id);

            // Send emails
            input.userEmails.forEach(async (email) => {
                // TODO: Here you would integrate with your email service to send the invite
                console.log(`Sending invite to ${email}: ${inviteUrl}`);
            });

            return {
                success: true,
                invites: input.userEmails.length,
            };
        }),
});

