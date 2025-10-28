import { pgEnum, integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import { usersTable } from "./users";
import { teamsTable } from "./teams";

// Define the role enum for team members
export const teamRoleEnum = pgEnum("team_role", ["owner", "admin", "user"]);

export const userTeamJunctionTable = pgTable(
    "user_team_junc", 
    {
        userId: integer("user_id").notNull().references(() : AnyPgColumn => usersTable.id, { onDelete: "cascade" }),
        teamId: integer("team_id").notNull().references(() : AnyPgColumn => teamsTable.id, { onDelete: "cascade" }),
        role: teamRoleEnum("role").notNull().default("user"),
    },
    (table) => [
        primaryKey({ columns: [table.teamId, table.userId] }),
    ]
);

export type TeamRole = "owner" | "admin" | "user";
export type UserTeamMapping = typeof userTeamJunctionTable.$inferInsert;
