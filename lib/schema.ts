// Canonical TypeScript types for a LawLLMsTxt firm record.
// Keep in sync with scripts/validate-firms.mjs (CI validator).

export type FirmSize = "solo" | "small" | "midsize" | "large";
export type FeeModel = "contingency" | "hourly" | "flat" | "free-consultation";
export type FirmStatus = "pending" | "verified" | "broken" | "rejected";
export type Plan = "free" | "lifetime";

export interface BarAdmission {
  state: string;
  barNumber: string;
  attorneyName: string;
}
export interface Location {
  city: string;
  state: string;
}

export interface Firm {
  schemaVersion: number;
  id: string;
  slug: string;
  firmName: string;
  websiteUrl: string;
  llmsTxtUrl: string;
  llmsFullTxtUrl: string | null;
  description: string;
  jurisdictions: string[];
  practiceAreas: string[];
  locations: Location[];
  firmSize: FirmSize;
  yearEstablished: number | null;
  languages: string[];
  feeModel: FeeModel[];

  // Trust layer
  barAdmissions: BarAdmission[];
  score: number;
  status: FirmStatus;
  verified: boolean;
  verifiedDate: string | null;
  verificationSource: string | null;

  // Plan / billing
  plan: Plan;               // "free" (1-month) or "lifetime" (paid, permanent)
  expiresAt: string | null; // ISO date free listings expire; null for lifetime

  dateAdded: string;
  lastVerified: string | null;
  submitterEmail: string;   // internal only
}

export const INTERNAL_FIELDS: (keyof Firm)[] = ["submitterEmail"];

export const REQUIRED_FIELDS: (keyof Firm)[] = [
  "firmName",
  "websiteUrl",
  "llmsTxtUrl",
  "description",
  "jurisdictions",
  "practiceAreas",
  "firmSize",
];
