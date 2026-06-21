import type { D1DatabaseInterface } from "../db/types.js";
import type { AuthContext } from "./auth.js";

export interface AuditEvent {
  toolName: string;
  userId: string;
  role: string;
  country?: string;
  locale?: string;
  timestamp: string;
}

export async function auditToolUsage(event: AuditEvent, _auth: AuthContext, db?: D1DatabaseInterface): Promise<void> {
  console.log(JSON.stringify({ event: "tool_usage", ...event }));
  if (db) {
    await db
      .prepare(
        "INSERT INTO audit_log (tool_name, user_id, role, country, locale, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
      )
      .bind(event.toolName, event.userId, event.role, event.country ?? null, event.locale ?? null, event.timestamp)
      .run();
  }
}
