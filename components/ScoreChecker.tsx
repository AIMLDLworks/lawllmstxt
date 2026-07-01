"use client";

import { useState } from "react";
import Link from "next/link";

type Row = { label: string; points: number; max: number; ok: boolean };
type Result = { found: boolean; score: number; llmsTxtUrl: string; breakdown: Row[] };

export default function ScoreChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function check() {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/score", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Could not check that site.");
      else setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  const scoreColor = (s: number) => (s >= 70 ? "text-emerald-600" : s >= 40 ? "text-amber-600" : "text-red-600");

  return (
    <section id="score" className="scroll-mt-24 overflow-hidden rounded-3xl bg-brand px-6 py-12 text-center text-white sm:px-10">
      <h2 className="text-2xl font-bold sm:text-3xl">What&rsquo;s your firm&rsquo;s AI Visibility Score?</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">Enter your website to see how well AI can read and cite your firm today. Free and instant.</p>

      <div className="mx-auto mt-6 flex max-w-lg flex-col gap-2 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") check(); }}
          placeholder="yourfirm.com"
          className="w-full rounded-xl px-4 py-3 text-sm text-slate-800 outline-none ring-1 ring-white/20 focus:ring-white"
        />
        <button onClick={check} disabled={loading} className="shrink-0 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:bg-slate-100 disabled:opacity-60">
          {loading ? "Checking..." : "Check score"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-200">{error}</p>}

      {result && (
        <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-white p-6 text-left text-slate-800 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">AI Visibility Score</div>
              <div className={"text-5xl font-bold " + scoreColor(result.score)}>
                {result.score}<span className="text-xl text-slate-400">/100</span>
              </div>
            </div>
            <div className="max-w-[45%] break-all text-right text-[11px] text-slate-400">{result.llmsTxtUrl}</div>
          </div>

          <ul className="mt-5 space-y-2 text-sm">
            {result.breakdown.map((b) => (
              <li key={b.label} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className={b.ok ? "text-emerald-500" : "text-slate-300"}>{b.ok ? "✓" : "✕"}</span>
                  {b.label}
                </span>
                <span className="text-xs text-slate-400">{b.points}/{b.max}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {result.score >= 70 ? (
              <Link href="/submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-accent">List your firm free</Link>
            ) : (
              <>
                <a href="https://firepencil.ai/llms-txt-generator/" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90">Improve with the free generator</a>
                <Link href="/submit" className="rounded-lg px-4 py-2 text-sm font-semibold text-brand ring-1 ring-slate-300 transition hover:ring-brand-accent">List free anyway</Link>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
