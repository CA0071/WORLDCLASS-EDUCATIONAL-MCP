import { handleHttpRoutes, handleMcpRequest } from "./server/mcpServer";
import type { RuntimeEnv } from "./security/auth";

export default {
  async fetch(request: Request, env: RuntimeEnv): Promise<Response> {
    const url = new URL(request.url);

    const routeResponse = handleHttpRoutes(url.pathname);
    if (routeResponse) {
      return routeResponse;
    }

    if (url.pathname === "/mcp" && request.method === "POST") {
      return handleMcpRequest(request, env);
    }

    return Response.json(
      {
        error: "Not found",
        availableRoutes: ["POST /mcp", "GET /health", "GET /android/contracts"],
      },
      { status: 404 },
    );
  },
};
