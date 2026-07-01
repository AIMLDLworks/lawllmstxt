"use client";

import { useState } from "react";
import practiceAreas from "@/data/taxonomy/practice-areas.json";
import jurisdictions from "@/data/taxonomy/jurisdictions.json";

const GENERATOR_URL = "https://firepencil.ai/llms-txt-generator/";

export default function SubmitPage() {
  const [form, setForm] = useState({
    firmName: "",
    websiteUrl: "",
    llmsTxtUrl: "",
    description: "",
    jurisdictions: [] as string[],
    practiceAreas: [] as string[],
    firmSize: "small",
    submitterEmail: "",
    barState: "",
    barNumber: "",
    attorneyName: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k: "jurisdictions" | "practiceAreas", v: string) =>
    setForm((f) => ({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] }));

  const valid =
    !!form.firmName && !!form.websiteUrl && !!form.llmsTxtUrl && !!form.description &&
    form.jurisdictions.length > 0 && form.practiceAreas.length > 0 &&
    !!form.barState && !!form.barNumber && !!form.attorneyName;

  async function submitFirm() {
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-12">
          <h1 className="text-2xl font-bold text-emerald-700">Thanks - your firm has been submitted!</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
            Your firm will appear in the directory shortly, marked as Pending. Once we verify your
            bar record, it earns the Verified trust badge. No further action is needed.
          </p>
          <a href="/" className="mt-6 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-accent">
            Back to the directory
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-brand">Get your law firm found by AI</h1>
      <p className="mt-2 text-sm text-slate-600">
        Join the largest llms.txt directory for U.S. law firms. It is free, takes about two
        minutes, and helps AI assistants like ChatGPT and Google AI find and recommend your firm
        accurately. Verified firms earn a trust badge.
      </p>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">New to llms.txt? Three quick steps:</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>
            <a href={GENERATOR_URL} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">Generate your llms.txt file</a> for free.
          </li>
          <li>
            Upload it to your website so it opens at <span className="font-mono text-slate-700">https://yourfirm.com/llms.txt</span>.
            On WordPress, add it with your SEO plugin or upload to the site root; on cPanel hosting,
            put the file in the <span className="font-mono">public_html</span> folder; on other site
            builders, add a file at the site root.
          </li>
          <li>Open that link in your browser to confirm it loads, then paste it below.</li>
        </ol>
      </div>

      <div className="mt-6 space-y-4">
        <Text label="Firm name *" value={form.firmName} onChange={(v) => update("firmName", v)} />
        <Text label="Website URL *" value={form.websiteUrl} onChange={(v) => update("websiteUrl", v)} placeholder="https://yourfirm.com" />
        <div>
          <Text label="llms.txt URL *" value={form.llmsTxtUrl} onChange={(v) => update("llmsTxtUrl", v)} placeholder="https://yourfirm.com/llms.txt" />
          <p className="mt-1 text-xs text-slate-500">
            The public link to your llms.txt on your own site, e.g. https://yourfirm.com/llms.txt. It
            must already be live - open it in a browser to check before submitting.
          </p>
        </div>
        <Area label="Short description *" value={form.description} onChange={(v) => update("description", v)} />

        <Multi
          label="Jurisdiction(s) *"
          options={jurisdictions.map((j) => ({ value: j.code, label: j.name }))}
          selected={form.jurisdictions}
          onToggle={(v) => toggle("jurisdictions", v)}
        />
        <Multi
          label="Practice area(s) *"
          options={practiceAreas.map((p) => ({ value: p.id, label: p.label }))}
          selected={form.practiceAreas}
          onToggle={(v) => toggle("practiceAreas", v)}
        />

        <Select label="Firm size" value={form.firmSize} onChange={(v) => update("firmSize", v)} options={["solo", "small", "midsize", "large"]} />

        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="px-1 text-sm font-medium text-slate-700">Bar admission - required for verification</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            <Text label="State *" value={form.barState} onChange={(v) => update("barState", v)} placeholder="CA" />
            <Text label="Bar number *" value={form.barNumber} onChange={(v) => update("barNumber", v)} />
            <Text label="Attorney name *" value={form.attorneyName} onChange={(v) => update("attorneyName", v)} />
          </div>
        </fieldset>

        <Text label="Contact email" value={form.submitterEmail} onChange={(v) => update("submitterEmail", v)} />

        {status === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

        <button
          disabled={!valid || status === "sending"}
          onClick={submitFirm}
          className="w-full rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition enabled:hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Submitting..." : "Submit my firm"}
        </button>
        {!valid && <p className="text-xs text-slate-400">Fill required fields (*) to enable submission.</p>}
      </div>
    </div>
  );
}

function Text({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
      />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Multi({ label, options, selected, onToggle }: { label: string; options: { value: string; label: string }[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-2 flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onToggle(o.value)}
            className={
              "rounded-full border px-2.5 py-1 text-xs transition " +
              (selected.includes(o.value)
                ? "border-brand-accent bg-brand-accent text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-accent")
            }
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
