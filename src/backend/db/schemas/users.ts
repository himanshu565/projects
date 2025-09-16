import { uniqueIndex } from "drizzle-orm/gel-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable(
    "users", 
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        publicId: varchar("public_id",{ length: 10 }).unique().notNull(),
        firstName: varchar("first_name", { length: 255 }).notNull(),
        lastName: varchar("last_name", { length: 255 }).notNull(),
        email: varchar({ length: 255 }).notNull().unique(),
    },
    (table) => [
        uniqueIndex("public_id").on(table.publicId),
        uniqueIndex("email_idx").on(table.email),
    ]
);

export type User = typeof usersTable.$inferInsert;
