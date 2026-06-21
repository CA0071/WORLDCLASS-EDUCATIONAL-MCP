export interface AndroidMcpRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: "initialize" | "tools/list" | "tools/call";
  params?: Record<string, unknown>;
}

export interface AndroidMcpResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string };
}

export const ANDROID_ENDPOINTS = {
  mcp: "/mcp",
  health: "/health",
  contracts: "/android/contracts",
} as const;

export const ANDROID_EXAMPLES = {
  toolCall: {
    jsonrpc: "2.0",
    id: "1",
    method: "tools/call",
    params: {
      name: "create_study_plan",
      arguments: {
        topic: "Algebraic Expressions",
        weeks: 4,
        locale: "en-ZA",
        country: "ZA",
        grade: "8",
        phase: "senior",
        language: "English",
      },
    },
  },
  offlineSyncHook: {
    strategy: "client_generates_operation_id",
    reconciliation: "retry-with-backoff-and-idempotency-key",
  },
};
