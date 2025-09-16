import { integer, PgColumn, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const docsTable = pgTable(
    "docs", 
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        publicId: varchar("public_id", { length: 10 }).unique().notNull(),
        name: varchar("doc_name", { length: 255 }).notNull(),
        ownerId: integer().references((): PgColumn => usersTable.id),
        numRef: integer().notNull(),
    },
    (table) => [
        uniqueIndex("public_id_idx").on(table.publicId),
    ]
);

export type Doc = typeof docsTable.$inferInsert;
