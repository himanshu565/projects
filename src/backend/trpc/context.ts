import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { CreateInnerContextOptions } from '../../types/trpcTypes.js';
import { db } from '../index.js';

export async function createContextInner(opts?: CreateInnerContextOptions){
    return {
        db,
        user: opts?.user,
    };
}

export async function createContext(opts: CreateExpressContextOptions){

    const contextInner = await createContextInner();

    return {
        ...contextInner,
        req: opts.req,
        res: opts.res,
    }
}

export type Context = Awaited<ReturnType<typeof createContextInner>>;
