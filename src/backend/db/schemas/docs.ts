import { integer, PgColumn, pgTable, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const docsTable = pgTable(
    "docs", 
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        name: varchar("doc_name", { length: 255 }).notNull(),
        ownerId: integer().references((): PgColumn => usersTable.id),
        numRef: integer().notNull(),
    },
);

export type Doc = typeof docsTable.$inferInsert;
