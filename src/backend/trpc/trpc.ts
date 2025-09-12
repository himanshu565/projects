import { initTRPC } from '@trpc/server';
import type { Context } from './context.js';
import { jwtMiddleware } from '../auth/middleware.js';

const t = initTRPC.context<Context>().create();
 
export const router = t.router;
export const publicProcedure = t.procedure.use(jwtMiddleware);

