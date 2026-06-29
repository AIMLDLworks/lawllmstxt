// Canonical TypeScript types for a LawLLMsTxt firm record.
// The JSON files in /data/firms/*.json must conform to this shape.
// Keep this in sync with scripts/validate-firms.mjs (CI validator).

export type FirmSize = "solo" | "small" | "midsize" | "large";

export type FeeModel =
  | "contingency"
  | "hourly"
  | "flat"
  | "free-consultation";

export type FirmStatus = "pending" | "verified" | "broken" | "rejected";

export interface BarAdmission {
  state: string;        // 2-letter jurisdiction code, e.g. "CA"
  barNumber: string;    // attorney's bar number in that state
  attorneyName: string; // name as listed on the bar record
}

export interface Location {
  city: string;
  state: string; // 2-letter code
}

export interface Firm {
  schemaVersion: number;
  id: string;                 // stable LawLLMsTxt ID, e.g. "LX-000001"
  slug: string;               // URL slug, matches the filename
  firmName: string;
  websiteUrl: string;
  llmsTxtUrl: string;
  llmsFullTxtUrl: string | null;
  description: string;
  jurisdictions: string[];    // jurisdiction codes
  practiceAreas: string[];    // practice-area ids
  locations: Location[];
  firmSize: FirmSize;
  yearEstablished: number | null;
  languages: string[];
  feeModel: FeeModel[];

  // Internal / trust layer
  barAdmissions: BarAdmission[];
  score: number;              // 0-100 best-practice score
  status: FirmStatus;
  verified: boolean;
  verifiedDate: string | null;
  verificationSource: string | null;
  dateAdded: string;
  lastVerified: string | null;
  submitterEmail: string;     // internal only — never rendered publicly
}

// Fields that must never be exposed on public pages or in the public API.
export const INTERNAL_FIELDS: (keyof Firm)[] = ["submitterEmail"];

// Required fields a submission must include.
export const REQUIRED_FIELDS: (keyof Firm)[] = [
  "firmName",
  "websiteUrl",
  "llmsTxtUrl",
  "description",
  "jurisdictions",
  "practiceAreas",
  "firmSize",
];
