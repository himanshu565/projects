import express from 'express';
import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { z } from 'zod'; 
import { readdir } from 'node:fs/promises';

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({})

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();
 
const router = t.router;
export const publicProcedure = t.procedure;

const appRouter = router({
  lsroot: publicProcedure
    .query(
    async () => {
      const out = await readdir("/").catch((err) => {
        console.log(err);
      });
      return out;
    }
  ),
});

export type AppRouter = typeof appRouter;

export const expressMiddleware: express.Handler = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});

