import Link from "next/link";
import ScoreChecker from "@/components/ScoreChecker";
import { getAllFirms, PRACTICE_AREAS, practiceLabel, daysLeft } from "@/lib/firms";

const BASE = "https://lawllmstxt.com";
const LIFETIME_PRICE = "$49";
const GUMROAD_URL = "https://lawllmstxt.gumroad.com/l/lifetime";
const FREE_URL = "https://lawllmstxt.gumroad.com/l/freelisting";
const AVATAR_COLORS = ["#1F3A5F", "#2E75B6", "#1D9E75", "#D85A30", "#7F77DD", "#D4537E"];

const STATS = [
  { value: "~77%", label: "of legal searches now trigger AI answers" },
  { value: "400,000+", label: "U.S. law firms AI needs to understand" },
  { value: "100% free", label: "to get started" },
];

const BENEFITS = [
  { icon: "cite", title: "Get cited by AI", body: "AI assistants read your llms.txt and represent your firm accurately, instead of guessing or leaving you out." },
  { icon: "shield", title: "Free & verified", body: "Start free. We check your bar record, so a Verified badge means a real, licensed firm." },
  { icon: "bolt", title: "Live in ~2 minutes", body: "Submit your llms.txt link and a few details. We handle indexing and publishing for you." },
];

const STEPS = [
  { title: "Have your llms.txt live", body: "Make sure it opens at yourfirm.com/llms.txt." },
  { title: "Submit the link", body: "Add your llms.txt link and firm details here." },
  { title: "Get verified and listed", body: "We bar-verify your firm and publish it. Go Lifetime to stay listed." },
];

const FAQS = [
  { q: "What is an llms.txt file?", a: "An llms.txt file is a plain-text file placed at a website's root that gives AI systems a clean, structured summary of the site's content, written for machines to read efficiently." },
  { q: "Why do law firms need an llms.txt file?", a: "It lets AI assistants correctly understand a firm's practice areas, jurisdictions, and services, making the firm far more likely to be cited accurately in AI answers instead of being omitted or misrepresented." },
  { q: "Is it free to list?", a: "Yes. Every firm gets a free verified listing for one month. To keep your firm listed permanently, upgrade once to a Lifetime listing." },
  { q: "What happens after the free month?", a: "Free listings show a Removing soon notice as they near 30 days and are removed unless you upgrade to Lifetime. Lifetime listings never expire." },
  { q: "Does llms.txt help my firm appear in AI search like ChatGPT and Google AI Overviews?", a: "It improves the chances. AI systems increasingly answer legal questions directly, and structured, machine-readable content makes your firm easier to find, understand, and cite." },
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

function BenefitIcon({ name }: { name: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "h-5 w-5" };
  if (name === "shield") {
    return (<svg viewBox="0 0 24 24" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>);
  }
  if (name === "bolt") {
    return (<svg viewBox="0 0 24 24" {...p}><path d="M13 2L3 14h8l-1 8 11-13h-8l0-7z" /></svg>);
  }
  return (<svg viewBox="0 0 24 24" {...p}><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
}

function PlanTag({ plan, expiresAt }: { plan: string; expiresAt: string | null }) {
  if (plan === "lifetime") return <div className="mt-1 text-[11px] font-semibold text-brand-accent">Lifetime</div>;
  if (plan === "free" && expiresAt) {
    const d = daysLeft(expiresAt);
    if (d !== null && d <= 7) return <div className="mt-1 text-[11px] font-semibold text-amber-600">Removing soon</div>;
    return <div className="mt-1 text-[11px] text-slate-400">Free{d !== null ? " · " + Math.min(d, 30) + "d left" : ""}</div>;
  }
  return null;
}

function Check({ light }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={"mt-0.5 h-4 w-4 shrink-0 " + (light ? "text-white" : "text-brand-accent")}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
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
    mainEntity: { "@type": "ItemList", itemListElement: firms.map((f, i) => ({ "@type": "ListItem", position: i + 1, url: BASE + "/firm/" + f.slug, name: f.firmName })) },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#eef4fb] to-white px-6 py-20 text-center ring-1 ring-slate-900/5 sm:py-24">
        <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-accent shadow-sm ring-1 ring-slate-900/5">
          Get found by AI
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight text-brand sm:text-6xl">
          The world&rsquo;s first llms.txt directory for U.S. law firms
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Get your law firm found, understood, and cited by AI assistants like ChatGPT, Gemini, and Claude.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#pricing" className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-accent hover:shadow-md">List your firm</a>
          <a href="#directory" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 transition hover:text-brand hover:ring-brand-accent">Browse the directory</a>
        </div>
        <p className="mt-5 text-xs text-slate-400">Free for 1 month &middot; Lifetime from {LIFETIME_PRICE} &middot; Bar-verified</p>
      </section>

      {/* Why it matters */}
      <section className="rounded-2xl bg-brand-light/50 px-6 py-12 text-center ring-1 ring-slate-900/5">
        <h2 className="mx-auto max-w-3xl text-2xl font-bold tracking-tight text-brand sm:text-3xl">Make sure AI gets your firm right</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          When clients ask AI for legal help, the firms with a verified llms.txt are the ones it finds and cites.
        </p>
      </section>


      {/* AI Visibility Score */}
      <ScoreChecker />

      {/* Stat band */}
      <section className="grid grid-cols-1 divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STATS.map((s) => (
          <div key={s.label} className="px-6 py-7 text-center">
            <div className="text-3xl font-bold tracking-tight text-brand">{s.value}</div>
            <div className="mx-auto mt-1.5 max-w-[16rem] text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Benefits */}
      <section className="grid gap-6 md:grid-cols-3">
        {BENEFITS.map((b) => (
          <div key={b.title} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand"><BenefitIcon name={b.icon} /></div>
            <h3 className="mt-4 text-base font-semibold text-brand">{b.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{b.body}</p>
          </div>
        ))}
      </section>

      {/* About + What is llms.txt */}
      <section className="grid gap-10 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5 md:grid-cols-2 sm:p-10">
        <div>
          <h2 className="text-xl font-semibold text-brand">About the directory</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">LawLLMsTxt is the largest public directory of <code>llms.txt</code> files published by U.S. law firms. We give AI systems a single, verified place to find accurate information about each firm, so when someone asks an AI about a lawyer, the firm&rsquo;s own structured content is what gets used, not a guess.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-brand">What is llms.txt and why it matters</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">An <code>llms.txt</code> file sits at a website&rsquo;s root and gives AI a clean, structured summary of its content. For a law firm, that means AI tools correctly understand your practice areas and jurisdictions, and are far more likely to <strong>cite you accurately</strong> instead of omitting you.</p>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-center text-xl font-semibold text-brand">How to get listed</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-500">Three simple steps, about two minutes total.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-900/5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-sm">{i + 1}</div>
              <h3 className="mt-4 text-base font-semibold text-brand">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24">
        <h2 className="text-center text-xl font-semibold text-brand">Simple pricing</h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-500">Start free. Upgrade once for a permanent listing.</p>
        <div className="mx-auto mt-8 grid max-w-3xl items-stretch gap-6 sm:grid-cols-2">
          <div className="flex flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-900/5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Free</h3>
            <div className="mt-3 flex items-baseline gap-1"><span className="text-4xl font-bold text-brand">$0</span><span className="text-sm text-slate-500">/ 1 month</span></div>
            <p className="mt-2 text-sm text-slate-600">Get listed and verified for 30 days.</p>
            <ul className="mt-5 space-y-2.5 text-sm text-slate-600">
              <li className="flex gap-2"><Check /> Verified listing for 1 month</li>
              <li className="flex gap-2"><Check /> Appears in the directory and AI index</li>
              <li className="flex gap-2"><Check /> Removed after 30 days unless upgraded</li>
            </ul>
            <a href={FREE_URL} target="_blank" rel="noopener noreferrer" className="mt-6 block rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-brand ring-1 ring-slate-300 transition hover:ring-brand-accent">List free for 1 month</a>
          </div>

          <div className="relative flex flex-col rounded-2xl bg-brand p-7 text-white shadow-md ring-1 ring-brand">
            <span className="absolute right-5 top-5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium">Best value</span>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/70">Lifetime</h3>
            <div className="mt-3 flex items-baseline gap-1"><span className="text-4xl font-bold">{LIFETIME_PRICE}</span><span className="text-sm text-white/70">one-time</span></div>
            <p className="mt-2 text-sm text-white/80">Pay once. Your firm stays listed forever.</p>
            <ul className="mt-5 space-y-2.5 text-sm text-white/90">
              <li className="flex gap-2"><Check light /> Permanent listing, never expires</li>
              <li className="flex gap-2"><Check light /> Priority placement and Lifetime badge</li>
              <li className="flex gap-2"><Check light /> Bar-verified trust badge</li>
            </ul>
            <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer" className="mt-6 block rounded-xl bg-white px-4 py-2.5 text-center text-sm font-semibold text-brand transition hover:bg-slate-100">Get Lifetime for {LIFETIME_PRICE}</a>
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-center text-xs text-slate-400">Prefer to start free? List free now and upgrade to Lifetime anytime before your 30 days end.</p>
      </section>

      {/* Directory listing */}
      <section id="directory" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-brand">Browse the directory</h2>
            <p className="mt-1 text-sm text-slate-500">{firms.length} firms listed.</p>
          </div>
          <a href="#pricing" className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-accent">+ Add your firm</a>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <FilterTab label="All" href="/#directory" active={!active} />
          {PRACTICE_AREAS.map((p) => (<FilterTab key={p.id} label={p.label} href={"/?area=" + p.id + "#directory"} active={active === p.id} />))}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f) => (
            <div key={f.id} className="relative flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="absolute right-3 top-3 flex flex-col items-center justify-center rounded-lg px-2.5 py-1 text-white shadow-sm" style={{ backgroundColor: f.score >= 70 ? "#1D9E75" : f.score >= 40 ? "#D97706" : "#94A3B8" }}>
                <span className="text-base font-bold leading-none">{f.score}</span>
                <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide leading-none opacity-80">AI score</span>
              </div>
              <div className="flex items-center gap-3 pr-16">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ backgroundColor: colorFor(f.firmName) }}>{initials(f.firmName)}</span>
                <div className="min-w-0">
                  <Link href={"/firm/" + f.slug} className="block truncate font-semibold text-brand hover:underline">{f.firmName}</Link>
                  <a href={f.websiteUrl} target="_blank" rel="nofollow noopener" className="block truncate text-xs text-brand-accent hover:underline">{hostname(f.websiteUrl)}</a>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-slate-600">{f.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {f.practiceAreas.slice(0, 2).map((p) => (<span key={p} className="rounded-md bg-brand-light px-2 py-0.5 text-xs text-brand">{practiceLabel(p)}</span>))}
                {f.jurisdictions.slice(0, 3).map((j) => (<span key={j} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{j}</span>))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="truncate text-xs text-slate-500">{f.locations[0] ? f.locations[0].city + ", " + f.locations[0].state : "United States"}</span>
                {f.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>
                    Bar-verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />Pending</span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <PlanTag plan={f.plan} expiresAt={f.expiresAt} />
                <Link href={"/firm/" + f.slug} className="text-xs font-medium text-brand-accent hover:underline">View profile &rarr;</Link>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="col-span-full py-8 text-center text-sm text-slate-500">No firms listed in this area yet.</p>}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-xl font-semibold text-brand">Frequently asked questions</h2>
        <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
          {FAQS.map((f) => (
            <details key={f.q} className="group px-6 py-4">
              <summary className="cursor-pointer text-sm font-medium text-slate-800">{f.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </div>
  );
}

function FilterTab({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <a href={href} className={"shrink-0 rounded-full px-3 py-1 text-sm transition ring-1 " + (active ? "bg-brand-accent text-white ring-brand-accent" : "bg-white text-slate-600 ring-slate-200 hover:ring-brand-accent")}>{label}</a>
  );
}

function Badges({ items }: { items: string[] }) {
  const shown = items.slice(0, 2);
  const extra = items.length - shown.length;
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((i) => (<span key={i} className="truncate rounded-md bg-brand-light px-2 py-0.5 text-xs text-brand">{i}</span>))}
      {extra > 0 && <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500">+{extra}</span>}
    </div>
  );
}
