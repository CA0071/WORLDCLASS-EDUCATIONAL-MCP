import type { D1DatabaseInterface } from "../db/types.js";

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
  /** HS256 secret for JWT verification. Set via `wrangler secret put JWT_SECRET`. */
  JWT_SECRET?: string;
  /** Cloudflare D1 database binding (APP_DB in wrangler.toml). */
  APP_DB?: D1DatabaseInterface;
}

interface JwtPayload {
  sub?: string;
  role?: string;
  exp?: number;
}

function base64UrlToBuffer(str: string): ArrayBuffer {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (str.length % 4)) % 4);
  const binary = atob(padded);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
}

async function verifyJwtHs256(token: string, secret: string): Promise<AuthContext> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT format.");
  }
  const [headerB64, payloadB64, signatureB64] = parts as [string, string, string];

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToBuffer(signatureB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`),
  );
  if (!valid) {
    throw new Error("Invalid JWT signature.");
  }

  const payload = JSON.parse(new TextDecoder().decode(base64UrlToBuffer(payloadB64))) as JwtPayload;

  if (typeof payload.exp === "number" && Math.floor(Date.now() / 1000) > payload.exp) {
    throw new Error("JWT expired.");
  }

  const role = payload.role;
  if (!role || !(["student", "teacher", "lecturer", "admin"] as string[]).includes(role)) {
    throw new Error("JWT missing valid role claim.");
  }

  return { userId: payload.sub ?? "jwt-user", role: role as UserRole, token };
}

export async function verifyToken(token: string | undefined, env: RuntimeEnv): Promise<AuthContext> {
  if (!token) {
    throw new Error("Missing bearer token.");
  }

  if (env.AUTH_BYPASS_TOKEN && token === env.AUTH_BYPASS_TOKEN) {
    return { userId: "dev-user", role: "admin", token };
  }

  if (env.JWT_SECRET) {
    return verifyJwtHs256(token, env.JWT_SECRET);
  }

  // Stub fallback for local development when JWT_SECRET is not set.
  const parts = token.split(":");
  if (parts.length === 2) {
    const role = parts[1];
    if (role && (["student", "teacher", "lecturer", "admin"] as string[]).includes(role)) {
      const userId = parts[0]?.trim();
      if (userId) {
        return { userId, role: role as UserRole, token };
      }
    }
  }

  throw new Error("Token verification failed. Set JWT_SECRET for production or use stub format userId:role for development.");
}
