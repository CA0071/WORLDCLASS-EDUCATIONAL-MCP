import type { AuthContext } from "./auth";

export interface AuditEvent {
  toolName: string;
  userId: string;
  role: string;
  country?: string;
  locale?: string;
  timestamp: string;
}

export async function auditToolUsage(event: AuditEvent, _auth: AuthContext): Promise<void> {
  console.log(JSON.stringify({ event: "tool_usage", ...event }));
}
