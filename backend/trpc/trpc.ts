import { initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { docRouter } from './docRouter.js';

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({})

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

