import { publicProcedure, router } from "./trpc.js";
import { z } from 'zod';

export const docRouter = router({
    getTeamDocs: 
        publicProcedure
        .query((opts) => {
            //TODO: Should fetch the list of docs managed by a team, from the DB (team operation)
            const { ctx } = opts;
            return [
                {
                    docName: "doc1", // other details...
                }
            ];
        }),
    getDocMetadata:
        publicProcedure.input(
            z.object({
                userId: z.string(),
                docId: z.string()
            })
        )
        .query((opts) => {
            //TODO: Should fetch doc details: size, name, type etc. (owner operation)
            return {
            };
        }),
});
