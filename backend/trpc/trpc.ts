import express from 'express';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { teamRouter } from './teamRouter.js';

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({})

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

const appRouter = router({
    teamRouter: teamRouter,
});

export type AppRouter = typeof appRouter;

export const expressMiddleware: express.Handler = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});

