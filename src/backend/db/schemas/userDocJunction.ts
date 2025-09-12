import { boolean, integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { usersTable } from "./users";
import { docsTable } from "./docs";

export const userDocJunctionTable = pgTable(
    "user_doc_junc", 
    {
        userId: integer("user_id").notNull().references(() : AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
        docId: integer("doc_id").notNull().references(() : AnyPgColumn => docsTable.id, { onDelete: "cascade" }),
        readPerm: boolean("remove_doc_perm").notNull(),
        writePerm: boolean("add_user_perm").notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.docId, table.userId] }),
    ]
);
