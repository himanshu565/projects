import { pgEnum, integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { usersTable } from "./users";
import { docsTable } from "./docs";

// Define the role enum for document members
export const docRoleEnum = pgEnum("doc_role", ["owner", "readwrite", "readonly"]);

export const userDocJunctionTable = pgTable(
    "user_doc_junc", 
    {
        userId: integer("user_id").notNull().references(() : AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
        docId: integer("doc_id").notNull().references(() : AnyPgColumn => docsTable.id, { onDelete: "cascade" }),
        role: docRoleEnum("role").notNull().default("readonly"),
    },
    (table) => [
        primaryKey({ columns: [table.docId, table.userId] }),
    ]
);

export type DocRole = "owner" | "readwrite" | "readonly";
export type UserDocMapping = typeof userDocJunctionTable.$inferInsert;
