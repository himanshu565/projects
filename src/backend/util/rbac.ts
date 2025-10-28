import type { TeamRole } from "../db/schemas/teamUserJunction.js";
import type { DocRole } from "../db/schemas/userDocJunction.js";

/**
 * Check if a role has owner permissions
 */
export function isTeamOwner(role: TeamRole): boolean {
    return role === "owner";
}

/**
 * Check if a role has admin or owner permissions
 */
export function isTeamAdminOrOwner(role: TeamRole): boolean {
    return role === "admin" || role === "owner";
}

/**
 * Check if a user has permission to perform an action based on their role
 * Permissions:
 * - Owner: All permissions
 * - Admin: Most permissions except ownership changes
 * - User: Read-only and basic write permissions
 */
export function hasTeamPermissions(
    role: TeamRole,
    requiredRole: "owner" | "admin" | "user"
): boolean {
    
    const roleHierarchy = { owner: 3, admin: 2, user: 1 };
    const userLevel = roleHierarchy[role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;
    
    return userLevel >= requiredLevel;
}

/**
 * Get the role level for comparison
 */
export function getRoleLevel(role: TeamRole): number {
    const roleHierarchy = { owner: 3, admin: 2, user: 1 };
    return roleHierarchy[role] || 0;
}

