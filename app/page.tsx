import Link from "next/link";
import { getAllFirms, PRACTICE_AREAS, practiceLabel } from "@/lib/firms";

// Static page — the full table is in the HTML at build time, so search engines
// and AI fetchers read every firm without running JavaScript.

const AVATAR_COLORS = ["#1F3A5F", "#2E75B6", "#1D9E75", "#D85A30", "#7F77DD", "#D4537E"];

function initials(name: string) {
  const words = name.replace(/[^A-Za-z0-9 ]/g, "").trim().split(/\s+/);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}
function colorFor(name: string) {
  let h = 0;
  for (const c of name) h = (h + c.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}
function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function HomePage({ searchParams }: { searchParams: { area?: string } }) {
  const firms = getAllFirms();
  const active = searchParams.area;
  const filtered = active ? firms.filter((f) => f.practiceAreas.includes(active)) : firms;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand">U.S. Law Firm Directory</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            A public llms.txt directory so AI systems can access accurate, verified
            information about each firm. {firms.length} firms listed.
          </p>
        </div>
        <Link
          href="/submit"
          className="shrink-0 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-accent"
        >
          + Add your firm
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        <FilterTab label="All" href="/" active={!active} />
        {PRACTICE_AREAS.map((p) => (
          <FilterTab key={p.id} label={p.label} href={`/?area=${p.id}`} active={active === p.id} />
        ))}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[880px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Firm</th>
              <th className="px-4 py-3 font-medium">Website</th>
              <th className="px-4 py-3 font-medium">Jurisdictions</th>
              <th className="px-4 py-3 font-medium">Practice areas</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                {/* Firm: logo + name + description */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: colorFor(f.firmName) }}
                    >
                      {initials(f.firmName)}
                    </span>
                    <div className="min-w-0">
                      <Link href={`/firm/${f.slug}`} className="block font-medium text-brand hover:underline">
                        {f.firmName}
                      </Link>
                      <span className="block max-w-xs truncate text-xs text-slate-400">{f.description}</span>
                    </div>
                  </div>
                </td>

                {/* Website */}
                <td className="px-4 py-3 text-sm">
                  <a
                    href={f.websiteUrl}
                    target="_blank"
                    rel="nofollow noopener"
                    className="text-brand-accent hover:underline"
                  >
                    {hostname(f.websiteUrl)}
                  </a>
                </td>

                {/* Jurisdictions */}
                <td className="px-4 py-3">
                  <Badges items={f.jurisdictions} />
                </td>

                {/* Practice areas */}
                <td className="px-4 py-3">
                  <Badges items={f.practiceAreas.map(practiceLabel)} />
                </td>

                {/* Location */}
                <td className="px-4 py-3 text-sm text-slate-600">
                  {f.locations[0] ? `${f.locations[0].city}, ${f.locations[0].state}` : "—"}
                </td>

                {/* Status: Verified / Pending */}
                <td className="px-4 py-3">
                  {f.verified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      Pending
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-500">No firms listed in this area yet.</p>
        )}
      </div>
    </div>
  );
}

function FilterTab({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <a
      href={href}
      className={
        "shrink-0 rounded-full border px-3 py-1 text-sm transition " +
        (active
          ? "border-brand-accent bg-brand-accent text-white"
          : "border-slate-200 bg-white text-slate-600 hover:border-brand-accent")
      }
    >
      {label}
    </a>
  );
}

function Badges({ items }: { items: string[] }) {
  const shown = items.slice(0, 2);
  const extra = items.length - shown.length;
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((i) => (
        <span key={i} className="rounded bg-brand-light px-2 py-0.5 text-xs text-brand">
          {i}
        </span>
      ))}
      {extra > 0 && <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">+{extra}</span>}
    </div>
  );
}
