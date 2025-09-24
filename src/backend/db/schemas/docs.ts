import { integer, PgColumn, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const docsTable = pgTable(
    "docs", 
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        publicId: varchar("public_id", { length: 10 }).unique().notNull(),
        name: varchar("doc_name", { length: 255 }).notNull(),
        ownerId: integer("owner_id").references((): PgColumn => usersTable.id, { onDelete: "cascade" }).notNull(),
        lastEditorId: integer("last_editor_id").references((): PgColumn => usersTable.id, {onDelete: "cascade"}).notNull(),
        lastEdited: timestamp("last_edited_at").notNull().defaultNow(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("public_id_idx").on(table.publicId),
    ]
);

export type Doc = typeof docsTable.$inferInsert;
