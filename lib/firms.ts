import fs from "node:fs";
import path from "node:path";
import type { Firm } from "./schema";
import { INTERNAL_FIELDS } from "./schema";
import practiceAreas from "@/data/taxonomy/practice-areas.json";
import jurisdictions from "@/data/taxonomy/jurisdictions.json";

const FIRMS_DIR = path.join(process.cwd(), "data", "firms");

export type PublicFirm = Omit<Firm, "submitterEmail">;

export const PRACTICE_AREAS = practiceAreas as { id: string; label: string }[];
export const JURISDICTIONS = jurisdictions as { code: string; name: string }[];

const practiceMap = new Map(PRACTICE_AREAS.map((p) => [p.id, p.label]));
const jurisdictionMap = new Map(JURISDICTIONS.map((j) => [j.code, j.name]));

export const practiceLabel = (id: string) => practiceMap.get(id) ?? id;
export const jurisdictionName = (code: string) => jurisdictionMap.get(code) ?? code;

/** Strip internal-only fields before anything is rendered or served publicly. */
function toPublic(firm: Firm): PublicFirm {
  const copy: Record<string, unknown> = { ...firm };
  for (const f of INTERNAL_FIELDS) delete copy[f as string];
  return copy as PublicFirm;
}

/** Load every firm record from disk (build-time, static). */
export function getAllFirms(): PublicFirm[] {
  if (!fs.existsSync(FIRMS_DIR)) return [];
  return fs
    .readdirSync(FIRMS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(FIRMS_DIR, f), "utf-8")) as Firm)
    .map(toPublic)
    .sort((a, b) => a.firmName.localeCompare(b.firmName));
}

export function getFirmBySlug(slug: string): PublicFirm | undefined {
  return getAllFirms().find((f) => f.slug === slug);
}
