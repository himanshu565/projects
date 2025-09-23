import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { docsTable } from "./docs";
import { teamsTable } from "./teams";

export const teamDocJunctionTable = pgTable(
    "team_doc_junc", 
    {
        teamId: integer("team_id").notNull().references(() : AnyPgColumn => teamsTable.id, { onDelete: "cascade" }),
        docId: integer("doc_id").notNull().references(() : AnyPgColumn => docsTable.id, { onDelete: "cascade" }),
    },
    (table) => [
        primaryKey({ columns: [table.teamId, table.docId] }),
    ]
);
