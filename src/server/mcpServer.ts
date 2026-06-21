import { ANDROID_ENDPOINTS, ANDROID_EXAMPLES } from "../android/contracts";
import { INTEGRATIONS } from "../integrations/placeholders";
import { ensureApproved } from "../security/approval";
import { auditToolUsage } from "../security/audit";
import { verifyToken, type RuntimeEnv } from "../security/auth";
import { ensureRole } from "../security/policy";
import { getToolByName, listToolsForMcp } from "../tools/catalog";
import type { JsonRpcRequest, JsonRpcResponse } from "./types";

function ok(id: string | number | null, result: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result };
}

function failure(id: string | number | null, code: number, message: string, data?: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, error: { code, message, data } };
}

function getBearerToken(request: Request): string | undefined {
  const auth = request.headers.get("authorization") ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : undefined;
}

export async function handleMcpRequest(request: Request, env: RuntimeEnv): Promise<Response> {
  try {
    const body = (await request.json()) as JsonRpcRequest;
    const id = body.id ?? null;

    if (body.method === "initialize") {
      return Response.json(
        ok(id, {
          server: { name: "schoolme101-mcp", version: "1.0.0" },
          capabilities: { tools: true },
          androidEndpoints: ANDROID_ENDPOINTS,
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
        const approvalCode = typeof parsedData.approvalCode === "string" ? parsedData.approvalCode : undefined;
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
    const message = error instanceof Error ? error.message : "Unknown server error";
    return Response.json(failure(null, -32000, message), { status: 500 });
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
