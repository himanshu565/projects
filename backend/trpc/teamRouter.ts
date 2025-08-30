import { publicProcedure, router } from "./trpc.js";
import { z } from 'zod';

export const teamRouter = router({
    getTeams: 
        publicProcedure.input(z.string())
        .query((opts) => {
            //TODO: Should fetch the list of teams that user is a part of, from the DB
            const { input } = opts;
            return ['teamx'];
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
