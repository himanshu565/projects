import { integer, PgColumn, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { teamsTable } from "./teams";

export const invitesTable = pgTable(
    "invites", 
    {
        uuid: varchar("uuid", { length: 36 }).primaryKey().notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        inviterId: integer("inviter_id").references((): PgColumn => usersTable.id, { onDelete: "cascade" }).notNull(),
        teamId: integer("team_id").references((): PgColumn => teamsTable.id, { onDelete: "cascade" }).notNull(),
    },
);

export type Invite = typeof invitesTable.$inferInsert;
