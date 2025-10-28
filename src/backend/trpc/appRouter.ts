import express from 'express';
import { docRouter } from "./docRouter.js";
import * as trpcExpress from '@trpc/server/adapters/express';
import { router } from "./trpc.js";
import { createContext } from './context.js';
import { teamRouter } from './teamRouter.js';
import { userTeamRouter } from './userTeamRouter.js';

const appRouter = router({
    team: teamRouter,
    doc: docRouter,
    userTeam: userTeamRouter,
});

export type AppRouter = typeof appRouter;

export const expressMiddleware: express.Handler = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});

