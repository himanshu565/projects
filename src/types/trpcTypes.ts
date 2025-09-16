import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../db/schemas/users.js";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

interface InnerContext {
    db: NodePgDatabase,
    user: User,
}

interface CreateInnerContextOptions extends Partial<CreateExpressContextOptions> {
    user: User | null;
}

export type { CreateInnerContextOptions };
export type { InnerContext };
