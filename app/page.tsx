import Link from "next/link";
import { getAllFirms, PRACTICE_AREAS, practiceLabel } from "@/lib/firms";

const BASE = "https://lawllmstxt.com";
const GENERATOR_URL = "https://firepencil.ai/llms-txt-generator/";
const AVATAR_COLORS = ["#1F3A5F", "#2E75B6", "#1D9E75", "#D85A30", "#7F77DD", "#D4537E"];

const FAQS = [
  {
    q: "What is an llms.txt file?",
    a: "An llms.txt file is a plain-text file placed at a website's root that gives AI systems a clean, structured summary of the site's content, written for machines to read efficiently.",
  },
  {
    q: "Why do law firms need an llms.txt file?",
    a: "It lets AI assistants correctly understand a firm's practice areas, jurisdictions, and services, making the firm far more likely to be cited accurately in AI answers instead of being omitted or misrepresented.",
  },
  {
    q: "How do I get my law firm listed on LawLLMsTxt?",
    a: "Use the Submit your llms.txt button. You provide your firm details and llms.txt URL. Once your file is validated and your bar record verified, your firm is published.",
  },
  {
    q: "Is LawLLMsTxt free?",
    a: "Yes. Listing your firm in the directory is free, and verified firms earn a trust badge at no cost.",
  },
  {
    q: "Does llms.txt help my firm appear in AI search like ChatGPT and Google AI Overviews?",
    a: "It improves the chances. AI systems increasingly answer legal questions directly, and structured, machine-readable content makes your firm easier to find, understand, and cite.",
  },
];

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

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "U.S. Law Firm llms.txt Directory",
    description: "The largest public directory of llms.txt files published by U.S. law firms.",
    url: BASE,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: firms.map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: BASE + "/firm/" + f.slug,
        name: f.firmName,
      })),
    },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center sm:px-10">
        <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-brand sm:text-4xl">
          The largest llms.txt directory for U.S. law firms
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
          A public, verified directory of law firms&rsquo; <code>llms.txt</code> files so AI
          assistants can find accurate, structured information about each firm and cite it correctly.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/submit" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-accent">
            Submit your llms.txt
          </Link>
          <a href={GENERATOR_URL} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-brand-accent hover:text-brand">
            Need a llms.txt file?
          </a>
        </div>
      </section>

      {/* About + What is llms.txt */}
      <section className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-brand">About the directory</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            LawLLMsTxt is the largest public directory of <code>llms.txt</code> files published by
            U.S. law firms. We give AI systems a single, verified place to find accurate information
            about each firm, so when someone asks an AI about a lawyer, the firm&rsquo;s own structured
            content is what gets used, not a guess. Listings are free, and verified firms earn a trust badge.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-brand">What is llms.txt and why it matters for law firms</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            An <code>llms.txt</code> file sits at a website&rsquo;s root and gives AI systems a clean,
            structured summary of its content, written for machines, not cluttered with menus and scripts.
            For a law firm, that means AI tools correctly understand your practice areas, jurisdictions, and
            services, and are far more likely to <strong>cite you accurately</strong> instead of omitting you.
            With most legal searches now triggering AI answers, this is how firms stay visible.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section className="rounded-xl border border-brand-light bg-brand-light/40 px-6 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-brand">Don&rsquo;t have an llms.txt file yet?</h2>
            <p className="mt-1 text-sm text-slate-600">Create one for free in minutes, then submit it to the directory.</p>
          </div>
          <a href={GENERATOR_URL} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg bg-brand-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
            Free llms.txt generator
          </a>
        </div>
      </section>

      {/* Directory listing */}
      <section id="directory" className="scroll-mt-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-brand">Browse the directory</h2>
            <p className="mt-1 text-sm text-slate-500">{firms.length} firms listed.</p>
          </div>
          <Link href="/submit" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-accent">
            + Add your firm
          </Link>
        </div>

        {/* Category filter tabs wrap to multiple lines, no horizontal scroll */}
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterTab label="All" href="/#directory" active={!active} />
          {PRACTICE_AREAS.map((p) => (
            <FilterTab key={p.id} label={p.label} href={"/?area=" + p.id + "#directory"} active={active === p.id} />
          ))}
        </div>

        {/* Table fits the page, no horizontal scroll */}
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[17%]" />
              <col className="w-[11%]" />
              <col className="w-[18%]" />
              <col className="w-[13%]" />
              <col className="w-[11%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-3 py-3 font-medium">Firm</th>
                <th className="px-3 py-3 font-medium">Website</th>
                <th className="px-3 py-3 font-medium">Jurisdictions</th>
                <th className="px-3 py-3 font-medium">Practice areas</th>
                <th className="px-3 py-3 font-medium">Location</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-b border-slate-100 align-middle last:border-0 hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: colorFor(f.firmName) }}>
                        {initials(f.firmName)}
                      </span>
                      <div className="min-w-0">
                        <Link href={"/firm/" + f.slug} className="block truncate text-sm font-medium text-brand hover:underline">
                          {f.firmName}
                        </Link>
                        <span className="block truncate text-xs text-slate-400">{f.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <a href={f.websiteUrl} target="_blank" rel="nofollow noopener" className="block truncate text-sm text-brand-accent hover:underline">
                      {hostname(f.websiteUrl)}
                    </a>
                  </td>
                  <td className="px-3 py-3">
                    <Badges items={f.jurisdictions} />
                  </td>
                  <td className="px-3 py-3">
                    <Badges items={f.practiceAreas.map(practiceLabel)} />
                  </td>
                  <td className="px-3 py-3 text-sm text-slate-600">
                    {f.locations[0] ? f.locations[0].city + ", " + f.locations[0].state : "-"}
                  </td>
                  <td className="px-3 py-3">
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
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20">
        <h2 className="text-xl font-semibold text-brand">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {FAQS.map((f) => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="cursor-pointer text-sm font-medium text-slate-800">{f.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Structured data for SEO / AEO / GEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
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
        <span key={i} className="truncate rounded bg-brand-light px-2 py-0.5 text-xs text-brand">
          {i}
        </span>
      ))}
      {extra > 0 && <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">+{extra}</span>}
    </div>
  );
}
