import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllFirms,
  getFirmBySlug,
  practiceLabel,
  jurisdictionName,
} from "@/lib/firms";
import Disclaimer from "@/components/Disclaimer";

// Pre-render one static page per firm.
export function generateStaticParams() {
  return getAllFirms().map((f) => ({ slug: f.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const firm = getFirmBySlug(params.slug);
  if (!firm) return { title: "Firm not found — LawLLMsTxt" };
  return {
    title: `${firm.firmName} — LawLLMsTxt`,
    description: firm.description,
  };
}

export default function FirmPage({ params }: { params: { slug: string } }) {
  const firm = getFirmBySlug(params.slug);
  if (!firm) notFound();

  return (
    <article className="mx-auto max-w-2xl">
      <a href="/" className="text-sm text-brand-accent hover:underline">
        &larr; Back to directory
      </a>

      <header className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand">{firm.firmName}</h1>
        {firm.verified && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            Bar-verified
          </span>
        )}
      </header>

      <p className="mt-3 text-slate-700">{firm.description}</p>

      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Website">
          <a href={firm.websiteUrl} className="text-brand-accent hover:underline" rel="nofollow">
            {firm.websiteUrl}
          </a>
        </Field>
        <Field label="llms.txt">
          <a href={firm.llmsTxtUrl} className="text-brand-accent hover:underline" rel="nofollow">
            {firm.llmsTxtUrl}
          </a>
        </Field>
        <Field label="Jurisdictions">
          {firm.jurisdictions.map(jurisdictionName).join(", ")}
        </Field>
        <Field label="Practice areas">
          {firm.practiceAreas.map(practiceLabel).join(", ")}
        </Field>
        <Field label="Locations">
          {firm.locations.map((l) => `${l.city}, ${l.state}`).join("; ") || "—"}
        </Field>
        <Field label="Firm size">{firm.firmSize}</Field>
        <Field label="Established">{firm.yearEstablished ?? "—"}</Field>
        <Field label="Languages">{firm.languages.join(", ") || "—"}</Field>
        <Field label="Best-practice score">{firm.score}/100</Field>
        <Field label="Status">{firm.status}</Field>
      </dl>

      <div className="mt-8 border-t border-slate-200 pt-4">
        <Disclaimer />
      </div>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-slate-800">{children}</dd>
    </div>
  );
}
