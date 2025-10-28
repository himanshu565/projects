import { eq, and } from "drizzle-orm";
import type { DocCardDetails } from "../../types/dataTypes.js";
import { docsTable } from "../db/schemas/docs.js";
import { teamDocJunctionTable } from "../db/schemas/teamDocJunction.js";
import { usersTable } from "../db/schemas/users.js";
import { teamsTable } from "../db/schemas/teams.js";
import { publicProcedure, router } from "./trpc.js";
import { z } from 'zod';
import { TRPCError } from "@trpc/server";
import fs from 'node:fs';
import { userTeamJunctionTable } from "../db/schemas/teamUserJunction.js";

export const docRouter = router({
    getTeamDocs: 
        publicProcedure.input(
            z.object({
                teamId: z.string() 
            })
        )
        .query(async (opts): Promise<DocCardDetails[]> => {
            const { input, ctx } = opts;

            // Check if user has access to the team
            const team = await ctx.db.select({
                id: teamsTable.id,
            })
                .from(teamsTable)
                .where(eq(teamsTable.publicId, input.teamId));

            if (team.length === 0 || team[0] === undefined) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Team not found."
                });
            }

            const userAccess = await ctx.db.select()
                .from(userTeamJunctionTable)
                .where(and(
                    eq(userTeamJunctionTable.userId, ctx.user.id),
                    eq(userTeamJunctionTable.teamId, team[0].id)
                ));

            if (userAccess.length === 0) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You do not have access to this team."
                });
            }

            // Fetch documents associated with the team
            const docDetails = await ctx.db.select({ 
                docId: docsTable.publicId,
                name: docsTable.name,
                ownerId: usersTable.publicId,
                ownerFirstName: usersTable.firstName,
                ownerLastName: usersTable.lastName,
                lastEdited: docsTable.lastEdited,
                lastEditorId: docsTable.lastEditorId,
            })
            .from(teamDocJunctionTable)
            .innerJoin(teamsTable, eq(teamDocJunctionTable.teamId, teamsTable.id))
            .innerJoin(docsTable, eq(teamDocJunctionTable.docId, docsTable.id))
            .innerJoin(usersTable, eq(docsTable.ownerId, usersTable.id))
            .where(eq(teamsTable.publicId, input.teamId));

            // Fetch last editor details for each document
            const lastEditorDetails = await Promise.all(docDetails.map(async (doc) => {
                const editor = await ctx.db.select({
                    lastEditorId: usersTable.publicId,
                    editorFirstName: usersTable.firstName,
                    editorLastName: usersTable.lastName,
                })
                .from(usersTable)
                .where(eq(usersTable.id, doc.lastEditorId));

                if(editor.length === 0 || editor[0] === undefined){
                    return {
                        lastEditorId: "unknown",
                        lastEditorFirstName: "Unknown",
                        lastEditorLastName: "User",
                    };
                }

                return {
                    lastEditorId: editor[0].lastEditorId,
                    lastEditorFirstName: editor[0].editorFirstName,
                    lastEditorLastName: editor[0].editorLastName,
                };
            }));

            if(docDetails.length !== lastEditorDetails.length){
                throw new TRPCError({ 
                    code: "INTERNAL_SERVER_ERROR", 
                    message: "Discrepancy in document and editor details length",
                });
            }

            // Fetch document sizes from filesystem
            const docSizes: number[] = docDetails.map((doc) => {
                const size = fs.statSync(`${process.env.APP_DOC_DIR}/${doc.docId}.txt`).size;
                return size;
            });
           
            // Combine all details into the final output
            const out: DocCardDetails[] = docDetails.map((doc, idx) => ({
                docId: doc.docId,
                name: doc.name,
                ownerId: doc.ownerId,
                ownerFirstName: doc.ownerFirstName,
                ownerLastName: doc.ownerLastName,
                lastEdited: doc.lastEdited.toISOString(),
                lastEditorId: lastEditorDetails[idx]?.lastEditorId,
                lastEditorFirstName: lastEditorDetails[idx]?.lastEditorFirstName,
                lastEditorLastName: lastEditorDetails[idx]?.lastEditorLastName,
                size: docSizes[idx],
            }));

            return out;
        }),

    getDocMetadata:
        publicProcedure.input(
            z.object({
                docId: z.string()
            })
        )
        .query((opts) => {
            // TODO: Implement fetching document metadata by docId

            return {
            };
        }),

    //TODO: Implement createDoc, editDocMetadata, deleteDoc etc.
});
