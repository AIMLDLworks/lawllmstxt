import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

  const breakdown: { label: string; points: number; max: number; ok: boolean }[] = [];
  const add = (label: string, ok: boolean, max: number) => breakdown.push({ label, ok, max, points: ok ? max : 0 });

  add("llms.txt is live and reachable", found, 40);
  add("Has a clear title (H1 heading)", found && /^#\s+.+/m.test(text), 15);
  add("Has a summary blockquote", found && /^>\s+.+/m.test(text), 15);
  add("Has structured sections", found && /^##\s+.+/m.test(text), 10);
  add("Links include descriptions", found && /\[[^\]]+\]\([^)]+\)\s*:/.test(text), 10);

  const full = found ? await fetchText(origin + "/llms-full.txt") : { ok: false, text: "" };
  add("Provides an llms-full.txt", full.ok && (full.text || "").trim().length > 0, 10);

  const score = breakdown.reduce((a, b) => a + b.points, 0);
  return NextResponse.json({ found, score, llmsTxtUrl, breakdown });
}
