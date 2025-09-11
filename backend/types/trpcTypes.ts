import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../db/schemas/users.js";

interface CreateInnerContextOptions extends Partial<CreateExpressContextOptions> {
    user: User | null;
}

export type { CreateInnerContextOptions };

