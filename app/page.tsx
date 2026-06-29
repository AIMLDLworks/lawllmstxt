import FirmCard from "@/components/FirmCard";
import { getAllFirms, PRACTICE_AREAS, practiceLabel } from "@/lib/firms";

// Static page — content is in the HTML at build time, so crawlers and AI
// fetchers can read every firm without executing JavaScript.
export default function HomePage({
  searchParams,
}: {
  searchParams: { area?: string };
}) {
  const firms = getAllFirms();
  const active = searchParams.area;
  const filtered = active
    ? firms.filter((f) => f.practiceAreas.includes(active))
    : firms;

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-brand">
          The llms.txt directory for U.S. law firms
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          A public data layer between AI systems and law firms&rsquo;{" "}
          <code>llms.txt</code> files. Browse {firms.length} firms with verified,
          structured information that AI assistants can read and cite accurately.
        </p>
      </section>

      <section className="mb-6 flex flex-wrap gap-2">
        <FilterChip label="All" href="/" activeLabel={!active} />
        {PRACTICE_AREAS.map((p) => (
          <FilterChip
            key={p.id}
            label={p.label}
            href={`/?area=${p.id}`}
            activeLabel={active === p.id}
          />
        ))}
      </section>

      {active && (
        <p className="mb-4 text-sm text-slate-500">
          Showing firms in <strong>{practiceLabel(active)}</strong>
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        {filtered.map((firm) => (
          <FirmCard key={firm.id} firm={firm} />
        ))}
      </section>

      {filtered.length === 0 && (
        <p className="text-slate-500">No firms listed in this area yet.</p>
      )}
    </div>
  );
}

function FilterChip({
  label,
  href,
  activeLabel,
}: {
  label: string;
  href: string;
  activeLabel: boolean;
}) {
  return (
    <a
      href={href}
      className={
        "rounded-full border px-3 py-1 text-sm transition " +
        (activeLabel
          ? "border-brand-accent bg-brand-accent text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-brand-accent")
      }
    >
      {label}
    </a>
  );
}
