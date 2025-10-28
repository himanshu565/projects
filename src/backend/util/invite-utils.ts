import { eq } from "drizzle-orm";
import { teamsTable } from "../db/schemas/teams.js";
import { db } from "../index.js";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { invitesTable, type Invite } from "../db/schemas/invite.js";

export const generateInviteLink = async (teamId: number, userId: number): Promise<string> => {

    const inviteToken: string = randomUUID();

    const newInvite: Invite = {
        uuid: inviteToken,
        inviterId: userId,
        teamId: team[0].id,
    }

    await db.insert(invitesTable).values(newInvite);

    if (process.env.APP_BASE_URL === undefined) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate invite link. Please try again."
        });
    }

    const inviteLink = `${process.env.APP_BASE_URL}/invite/${inviteToken}`;

    return inviteLink;
};
