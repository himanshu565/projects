import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { usersTable } from "./users";
import { uniqueIndex } from "drizzle-orm/mysql-core";

export const teamsTable = pgTable(
    "teams", 
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        publicId: varchar("public_id", { length: 10 }).unique().notNull(),
        teamName: varchar("team_name", { length: 255 }).notNull(),
        teamDesc: text("team_desc").notNull(),
        ownerId: integer("owner_id").notNull().references((): AnyPgColumn => usersTable.id),
    },
    (table) => [
        uniqueIndex("public_id_idx").on(table.publicId),
    ]
);

export type Team = typeof teamsTable.$inferInsert;
