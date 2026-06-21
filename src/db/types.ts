// Minimal structural interface for Cloudflare D1 operations.
// The Cloudflare Worker runtime provides the concrete D1Database that satisfies this contract.

export interface D1PreparedStatement {
  bind(...values: (string | number | boolean | null)[]): D1PreparedStatement;
  run(): Promise<{ success: boolean }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
}

export interface D1DatabaseInterface {
  prepare(sql: string): D1PreparedStatement;
}
