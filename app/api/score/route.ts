import { NextResponse } from "next/server";
import { getAllFirms } from "@/lib/firms";

export const runtime = "nodejs";

function safeHost(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, "").toLowerCase(); } catch { return ""; }
}

function toLlmsUrl(input: string): string | null {
  let s = (input || "").trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  let u: URL;
  try { u = new URL(s); } catch { return null; }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host.endsWith(".local") || host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("172.")) return null;
  if (/\/llms\.txt$/i.test(u.pathname)) return u.origin + u.pathname;
  return u.origin + "/llms.txt";
}

async function fetchText(url: string, ms = 8000): Promise<{ ok: boolean; text: string }> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal, redirect: "follow", headers: { "User-Agent": "LawLLMsTxt-ScoreBot" } });
    const text = res.ok ? await res.text() : "";
    return { ok: res.ok, text };
  } catch {
    return { ok: false, text: "" };
  } finally {
    clearTimeout(t);
  }
}

export async function POST(req: Request) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  const llmsTxtUrl = toLlmsUrl(body.url || "");
  if (!llmsTxtUrl) return NextResponse.json({ error: "Please enter a valid website address." }, { status: 400 });

  const origin = new URL(llmsTxtUrl).origin;
  const main = await fetchText(llmsTxtUrl);
  const text = main.text || "";
  const found = main.ok && text.trim().length > 0;

  const breakdown: { label: string; points: number; max: number; ok: boolean; group: "file" | "distribution" }[] = [];
  const add = (label: string, ok: boolean, max: number, group: "file" | "distribution") => breakdown.push({ label, ok, max, points: ok ? max : 0, group });

  // File quality (max 80)
  add("llms.txt is live and reachable", found, 30, "file");
  add("Has a clear title (H1 heading)", found && /^#\s+.+/m.test(text), 15, "file");
  add("Has a summary blockquote", found && /^>\s+.+/m.test(text), 10, "file");
  add("Has structured sections", found && /^##\s+.+/m.test(text), 10, "file");
  add("Links include descriptions", found && /\[[^\]]+\]\([^)]+\)\s*:/.test(text), 5, "file");
  const full = found ? await fetchText(origin + "/llms-full.txt") : { ok: false, text: "" };
  add("Provides an llms-full.txt", full.ok && (full.text || "").trim().length > 0, 10, "file");

  // Directory presence (max 20) — awarded by being in this directory
  const qHost = safeHost(llmsTxtUrl);
  let listed = false, verified = false;
  try {
    const firms = getAllFirms();
    const match = firms.find((f) => safeHost(f.websiteUrl) === qHost || safeHost(f.llmsTxtUrl) === qHost);
    listed = !!match;
    verified = !!(match && match.verified);
  } catch { /* directory not readable at runtime; treat as not listed */ }
  add("Listed in the LawLLMsTxt directory", listed, 10, "distribution");
  add("Bar-verified in the directory", verified, 10, "distribution");

  const fileScore = breakdown.filter((b) => b.group === "file").reduce((a, b) => a + b.points, 0);
  const distScore = breakdown.filter((b) => b.group === "distribution").reduce((a, b) => a + b.points, 0);
  const score = fileScore + distScore;

  return NextResponse.json({ found, score, fileScore, distScore, listed, verified, llmsTxtUrl, breakdown });
}
