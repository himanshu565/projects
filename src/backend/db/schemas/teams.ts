import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { usersTable } from "./users";

export const teamsTable = pgTable(
    "teams", 
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        teamName: varchar("team_name", { length: 255 }).notNull(),
        teamDesc: text("team_desc").notNull(),
        ownerId: integer("owner_id").notNull().references((): AnyPgColumn => usersTable.id),
    },
);

