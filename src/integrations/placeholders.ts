export interface IntegrationPlaceholder {
  provider: "canvas" | "google_classroom";
  status: "planned" | "stub";
  notes: string;
}

export const INTEGRATIONS: IntegrationPlaceholder[] = [
  {
    provider: "canvas",
    status: "stub",
    notes: "TODO: Implement OAuth 2.0 user-bound token exchange and scoped API adapters.",
  },
  {
    provider: "google_classroom",
    status: "planned",
    notes: "TODO: Implement service abstraction after consent and domain-wide delegation checks.",
  },
];
