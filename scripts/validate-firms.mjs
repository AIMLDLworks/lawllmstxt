// CI validator: checks every data/firms/*.json against the schema and taxonomy,
// and optionally confirms each llms.txt URL is live. Run: `npm run validate`.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const firmsDir = path.join(root, "data", "firms");
const practiceAreas = JSON.parse(fs.readFileSync(path.join(root, "data/taxonomy/practice-areas.json"), "utf-8"));
const jurisdictions = JSON.parse(fs.readFileSync(path.join(root, "data/taxonomy/jurisdictions.json"), "utf-8"));

const validAreas = new Set(practiceAreas.map((p) => p.id));
const validJurisdictions = new Set(jurisdictions.map((j) => j.code));
const REQUIRED = ["firmName", "websiteUrl", "llmsTxtUrl", "description", "jurisdictions", "practiceAreas", "firmSize"];
const SIZES = new Set(["solo", "small", "midsize", "large"]);

const CHECK_LIVE = process.argv.includes("--check-live");
let errors = 0;

function fail(file, msg) {
  console.error(`  ✗ ${file}: ${msg}`);
  errors++;
}

async function isLive(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}

const files = fs.existsSync(firmsDir)
  ? fs.readdirSync(firmsDir).filter((f) => f.endsWith(".json"))
  : [];

console.log(`Validating ${files.length} firm record(s)...`);

for (const file of files) {
  let firm;
  try {
    firm = JSON.parse(fs.readFileSync(path.join(firmsDir, file), "utf-8"));
  } catch (e) {
    fail(file, `invalid JSON: ${e.message}`);
    continue;
  }

  for (const key of REQUIRED) {
    if (firm[key] === undefined || firm[key] === null || firm[key] === "") {
      fail(file, `missing required field "${key}"`);
    }
  }

  const expectedSlug = file.replace(/\.json$/, "");
  if (firm.slug !== expectedSlug) fail(file, `slug "${firm.slug}" must match filename "${expectedSlug}"`);

  if (firm.firmSize && !SIZES.has(firm.firmSize)) fail(file, `invalid firmSize "${firm.firmSize}"`);

  for (const a of firm.practiceAreas ?? []) {
    if (!validAreas.has(a)) fail(file, `unknown practice area "${a}"`);
  }
  for (const j of firm.jurisdictions ?? []) {
    if (!validJurisdictions.has(j)) fail(file, `unknown jurisdiction "${j}"`);
  }

  if (firm.llmsTxtUrl && !/^https?:\/\//.test(firm.llmsTxtUrl)) {
    fail(file, `llmsTxtUrl must be an absolute http(s) URL`);
  }

  if (CHECK_LIVE && firm.llmsTxtUrl) {
    const live = await isLive(firm.llmsTxtUrl);
    if (!live) fail(file, `llms.txt not reachable: ${firm.llmsTxtUrl}`);
  }
}

if (errors > 0) {
  console.error(`\n${errors} error(s) found.`);
  process.exit(1);
}
console.log("All firm records valid.");
