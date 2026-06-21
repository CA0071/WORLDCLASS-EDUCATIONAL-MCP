import type { RuntimeEnv } from "./auth.js";

export function ensureApproved(approvalCode: string | undefined, env: RuntimeEnv): void {
  if (!approvalCode) {
    throw new Error("Approval code required for destructive operation.");
  }

  if (env.APPROVAL_BYPASS_CODE && approvalCode === env.APPROVAL_BYPASS_CODE) {
    return;
  }

  throw new Error("Approval failed (stub). Integrate managed approval service.");
}
