export type UserRole = "student" | "teacher" | "lecturer" | "admin";

export interface AuthContext {
  userId: string;
  role: UserRole;
  token: string;
}

export interface RuntimeEnv {
  AUTH_BYPASS_TOKEN?: string;
  APPROVAL_BYPASS_CODE?: string;
  AUDIT_LOG_SINK?: string;
}

export function verifyToken(token: string | undefined, env: RuntimeEnv): AuthContext {
  if (!token) {
    throw new Error("Missing bearer token");
  }

  if (env.AUTH_BYPASS_TOKEN && token === env.AUTH_BYPASS_TOKEN) {
    return { userId: "dev-user", role: "admin", token };
  }

  const parts = token.split(":");
  if (parts.length === 2) {
    const role = parts[1];
    if (role && ["student", "teacher", "lecturer", "admin"].includes(role)) {
      return { userId: "stub-user", role: role as UserRole, token };
    }
  }

  throw new Error("Token verification failed (stub). Replace with OIDC/JWT verifier.");
}
