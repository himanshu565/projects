import { publicProcedure, router } from "./trpc.js";
import { z } from 'zod';

export const docRouter = router({
    getTeamDocs: 
        publicProcedure.input(z.string())
        .query((opts) => {
            //TODO: Should fetch the list of docs managed by a team, from the DB (team operation)
            const { input } = opts;
            return ['team'];
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

    getDocData:
        publicProcedure.input(
            z.object({
                docName: z.string()
            })
        )
        .query((opts) => {
            //TODO: Should return the data in the queried doc for authorized users.
            return {

            };
        }),
});
