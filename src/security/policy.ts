import type { UserRole } from "./auth";

const rank: Record<UserRole, number> = {
  student: 1,
  teacher: 2,
  lecturer: 3,
  admin: 4,
};

export function ensureRole(userRole: UserRole, requiredRole: UserRole): void {
  if (rank[userRole] < rank[requiredRole]) {
    throw new Error(`Insufficient role. Required ${requiredRole}, got ${userRole}.`);
  }
}
