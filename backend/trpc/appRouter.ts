import express from 'express';
import { docRouter } from "./docRouter.js";
import * as trpcExpress from '@trpc/server/adapters/express';
import { router, createContext } from "./trpc.js";
import { teamRouter } from './teamRouter.js';

const appRouter = router({
    team: teamRouter,
    doc: docRouter,
});

export type AppRouter = typeof appRouter;

export const expressMiddleware: express.Handler = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});

