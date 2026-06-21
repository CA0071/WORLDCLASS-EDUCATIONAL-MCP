import { ANDROID_ENDPOINTS, ANDROID_EXAMPLES } from "../android/contracts.js";
import { INTEGRATIONS } from "../integrations/placeholders.js";
import { ensureApproved } from "../security/approval.js";
import { auditToolUsage } from "../security/audit.js";
import { verifyToken, type RuntimeEnv } from "../security/auth.js";
import { ensureRole } from "../security/policy.js";
import { getToolByName, listToolsForMcp } from "../tools/catalog.js";
import type { JsonRpcRequest, JsonRpcResponse } from "./types.js";

function ok(id: string | number | null, result: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result };
}

function failure(id: string | number | null, code: number, message: string, data?: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, error: { code, message, data } };
}

function errorResponse(id: string | number | null, error: unknown): Response {
  const message = error instanceof Error ? error.message : "Unknown server error";

  if (error instanceof SyntaxError) {
    return Response.json(failure(id, -32700, "Parse error"), { status: 400 });
  }

  if (
    message === "Missing bearer token." ||
    message === "Invalid JWT format." ||
    message === "Invalid JWT signature." ||
    message === "JWT expired." ||
    message === "JWT missing valid role claim." ||
    message.startsWith("Token verification failed.")
  ) {
    return Response.json(failure(id, -32001, message), { status: 401 });
  }

  if (message.startsWith("Insufficient role.") || message.startsWith("Approval ")) {
    return Response.json(failure(id, -32003, message), { status: 403 });
  }

  return Response.json(failure(id, -32000, message), { status: 500 });
}

function getBearerToken(request: Request): string | undefined {
  const auth = request.headers.get("authorization") ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : undefined;
}

export async function handleMcpRequest(request: Request, env: RuntimeEnv): Promise<Response> {
  let id: string | number | null = null;
  try {
    const body = (await request.json()) as JsonRpcRequest;
    id = body.id ?? null;

    if (body.method === "initialize") {
      return Response.json(
        ok(id, {
          protocolVersion: "2024-11-05",
          serverInfo: { name: "schoolme101-mcp", version: "1.0.0" },
          capabilities: { tools: {} },
        }),
      );
    }

    if (body.method === "tools/list") {
      return Response.json(ok(id, { tools: listToolsForMcp() }));
    }

    if (body.method === "tools/call") {
      const params = body.params ?? {};
      const name = typeof params.name === "string" ? params.name : "";
      const input = (params.arguments ?? {}) as Record<string, unknown>;
      const approvalCode =
        typeof params.approvalCode === "string" ? params.approvalCode : request.headers.get("x-approval-code") ?? undefined;
      const tool = getToolByName(name);

      if (!tool) {
        return Response.json(failure(id, -32601, `Tool not found: ${name}`), { status: 404 });
      }

      const auth = await verifyToken(getBearerToken(request), env);
      if (tool.requiredRole) {
        ensureRole(auth.role, tool.requiredRole);
      }

      const parsed = tool.inputSchema.safeParse(input);
      if (!parsed.success) {
        return Response.json(failure(id, -32602, "Invalid params", parsed.error.flatten()), { status: 400 });
      }

      const parsedData = parsed.data as Record<string, unknown>;

      if (tool.destructive) {
        ensureApproved(approvalCode, env);
      }

      const result = await tool.execute(parsedData, {
        role: auth.role,
        ...(env.APP_DB !== undefined ? { db: env.APP_DB } : {}),
      });
      const auditEvent: { toolName: string; userId: string; role: string; timestamp: string; country?: string; locale?: string } = {
        toolName: tool.name,
        userId: auth.userId,
        role: auth.role,
        timestamp: new Date().toISOString(),
      };
      if (typeof parsedData.country === "string") {
        auditEvent.country = parsedData.country;
      }
      if (typeof parsedData.locale === "string") {
        auditEvent.locale = parsedData.locale;
      }
      await auditToolUsage(auditEvent, auth, env.APP_DB);

      return Response.json(ok(id, { content: [{ type: "json", json: result }] }));
    }

    return Response.json(failure(id, -32601, `Method not found: ${body.method}`), { status: 404 });
  } catch (error) {
    return errorResponse(id, error);
  }
}

export function handleHttpRoutes(pathname: string): Response | null {
  if (pathname === "/health") {
    return Response.json({ status: "ok", service: "schoolme101-mcp", timestamp: new Date().toISOString() });
  }

  if (pathname === "/android/contracts") {
    return Response.json({ endpoints: ANDROID_ENDPOINTS, examples: ANDROID_EXAMPLES, integrations: INTEGRATIONS });
  }

  return null;
}
