"use client";

import { useState } from "react";
import practiceAreas from "@/data/taxonomy/practice-areas.json";
import jurisdictions from "@/data/taxonomy/jurisdictions.json";

// --- configure these for your repo ---
const GITHUB_OWNER = "your-org";
const GITHUB_REPO = "lawllmtxt";
const GITHUB_BRANCH = "main";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

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

  const update = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const toggle = (k: "jurisdictions" | "practiceAreas", v: string) =>
    setForm((f) => ({
      ...f,
      [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v],
    }));

  function buildRecord() {
    const slug = slugify(form.firmName);
    return {
      schemaVersion: 1,
      id: "LX-PENDING",
      slug,
      firmName: form.firmName,
      websiteUrl: form.websiteUrl,
      llmsTxtUrl: form.llmsTxtUrl,
      llmsFullTxtUrl: null,
      description: form.description,
      jurisdictions: form.jurisdictions,
      practiceAreas: form.practiceAreas,
      locations: [],
      firmSize: form.firmSize,
      yearEstablished: null,
      languages: [],
      feeModel: [],
      barAdmissions: form.barNumber
        ? [{ state: form.barState, barNumber: form.barNumber, attorneyName: form.attorneyName }]
        : [],
      score: 0,
      status: "pending",
      verified: false,
      verifiedDate: null,
      verificationSource: null,
      dateAdded: new Date().toISOString().slice(0, 10),
      lastVerified: null,
      submitterEmail: form.submitterEmail,
    };
  }

  function openPullRequest() {
    const record = buildRecord();
    const filename = `data/firms/${record.slug}.json`;
    const value = JSON.stringify(record, null, 2);
    const url =
      `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/new/${GITHUB_BRANCH}` +
      `?filename=${encodeURIComponent(filename)}&value=${encodeURIComponent(value)}`;
    window.open(url, "_blank");
  }

  const valid =
    form.firmName && form.websiteUrl && form.llmsTxtUrl && form.description &&
    form.jurisdictions.length > 0 && form.practiceAreas.length > 0;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-brand">Submit your firm</h1>
      <p className="mt-2 text-sm text-slate-600">
        Submitting opens a pre-filled pull request on GitHub. A maintainer
        validates your <code>llms.txt</code> and checks your bar record before the
        listing goes live. No account data is stored on a server &mdash; the
        directory is an open, public dataset.
      </p>

      <div className="mt-6 space-y-4">
        <Text label="Firm name *" value={form.firmName} onChange={(v) => update("firmName", v)} />
        <Text label="Website URL *" value={form.websiteUrl} onChange={(v) => update("websiteUrl", v)} placeholder="https://" />
        <Text label="llms.txt URL *" value={form.llmsTxtUrl} onChange={(v) => update("llmsTxtUrl", v)} placeholder="https://yourfirm.com/llms.txt" />
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

        <Select
          label="Firm size"
          value={form.firmSize}
          onChange={(v) => update("firmSize", v)}
          options={["solo", "small", "midsize", "large"]}
        />

        <fieldset className="rounded-lg border border-slate-200 p-4">
          <legend className="px-1 text-sm font-medium text-slate-700">
            Bar admission (for verification)
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            <Text label="State" value={form.barState} onChange={(v) => update("barState", v)} placeholder="CA" />
            <Text label="Bar number" value={form.barNumber} onChange={(v) => update("barNumber", v)} />
            <Text label="Attorney name" value={form.attorneyName} onChange={(v) => update("attorneyName", v)} />
          </div>
        </fieldset>

        <Text label="Contact email (internal only)" value={form.submitterEmail} onChange={(v) => update("submitterEmail", v)} />

        <button
          disabled={!valid}
          onClick={openPullRequest}
          className="w-full rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition enabled:hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Open pull request on GitHub
        </button>
        {!valid && (
          <p className="text-xs text-slate-400">
            Fill required fields (*) to enable submission.
          </p>
        )}
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
