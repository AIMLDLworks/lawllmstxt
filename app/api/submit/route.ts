import { NextResponse } from "next/server";
import practiceAreas from "@/data/taxonomy/practice-areas.json";
import jurisdictions from "@/data/taxonomy/jurisdictions.json";

export const runtime = "nodejs";

const OWNER = process.env.GITHUB_OWNER;
const REPO = process.env.GITHUB_REPO;
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN;
const FREE_DAYS = 30;

const validAreas = new Set((practiceAreas as { id: string }[]).map((p) => p.id));
const validJur = new Set((jurisdictions as { code: string }[]).map((j) => j.code));

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  if (!TOKEN || !OWNER || !REPO) {
    return NextResponse.json({ error: "The submission service is not configured yet." }, { status: 500 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const firmName = (body.firmName || "").trim();
  const websiteUrl = (body.websiteUrl || "").trim();
  const llmsTxtUrl = (body.llmsTxtUrl || "").trim();
  const description = (body.description || "").trim();
  const jur: string[] = Array.isArray(body.jurisdictions) ? body.jurisdictions : [];
  const areas: string[] = Array.isArray(body.practiceAreas) ? body.practiceAreas : [];
  const firmSize = body.firmSize || "small";
  const barState = (body.barState || "").trim();
  const barNumber = (body.barNumber || "").trim();
  const attorneyName = (body.attorneyName || "").trim();
  const submitterEmail = (body.submitterEmail || "").trim();

  if (!firmName || !websiteUrl || !llmsTxtUrl || !description || jur.length === 0 || areas.length === 0 || !barState || !barNumber || !attorneyName) {
    return NextResponse.json({ error: "Please fill in all required fields, including bar admission details." }, { status: 400 });
  }
  if (!/^https?:\/\//.test(websiteUrl) || !/^https?:\/\//.test(llmsTxtUrl)) {
    return NextResponse.json({ error: "Website and llms.txt must be full URLs starting with https://." }, { status: 400 });
  }
  for (const a of areas) if (!validAreas.has(a)) return NextResponse.json({ error: "Invalid practice area." }, { status: 400 });
  for (const j of jur) if (!validJur.has(j)) return NextResponse.json({ error: "Invalid jurisdiction." }, { status: 400 });

  let slug = slugify(firmName);
  if (!slug) return NextResponse.json({ error: "Invalid firm name." }, { status: 400 });

  const headers = {
    Authorization: "Bearer " + TOKEN,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  let path = "data/firms/" + slug + ".json";
  const check = await fetch("https://api.github.com/repos/" + OWNER + "/" + REPO + "/contents/" + path + "?ref=" + BRANCH, { headers });
  if (check.status === 200) {
    slug = slug + "-" + Date.now().toString(36);
    path = "data/firms/" + slug + ".json";
  }

  const today = new Date();
  const expiry = new Date();
  expiry.setDate(today.getDate() + FREE_DAYS);
  const expiresAt = expiry.toISOString().slice(0, 10);

  const record = {
    schemaVersion: 1,
    id: "LX-" + Date.now().toString(36),
    slug,
    firmName,
    websiteUrl,
    llmsTxtUrl,
    llmsFullTxtUrl: null,
    description,
    jurisdictions: jur,
    practiceAreas: areas,
    locations: [],
    firmSize,
    yearEstablished: null,
    languages: [],
    feeModel: [],
    barAdmissions: [{ state: barState, barNumber, attorneyName }],
    score: 0,
    status: "pending",
    verified: false,
    verifiedDate: null,
    verificationSource: null,
    plan: "free",
    expiresAt,
    dateAdded: today.toISOString().slice(0, 10),
    lastVerified: null,
    submitterEmail,
  };

  const content = Buffer.from(JSON.stringify(record, null, 2) + "\n").toString("base64");

  const put = await fetch("https://api.github.com/repos/" + OWNER + "/" + REPO + "/contents/" + path, {
    method: "PUT",
    headers,
    body: JSON.stringify({ message: "Add firm (free, pending): " + firmName, content, branch: BRANCH }),
  });

  if (!put.ok) {
    return NextResponse.json({ error: "Could not save your submission. Please try again shortly." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
