import { boolean, integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { usersTable } from "./users";
import { teamsTable } from "./teams";

export const userTeamJunctionTable = pgTable(
    "user_team_junc", 
    {
        userId: integer("user_id").notNull().references(() : AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
        teamId: integer("team_id").notNull().references(() : AnyPgColumn => teamsTable.id, { onDelete: "cascade" }),
        addUserPerm: boolean("add_user_perm").notNull(),
        removeUserPerm: boolean("remove_user_perm").notNull(),
        addDocPerm: boolean("add_doc_perm").notNull(),
        removeDocPerm: boolean("remove_doc_perm").notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.teamId, table.userId] }),
    ]
);

export type UserTeamMapping = typeof userTeamJunctionTable.$inferInsert;
