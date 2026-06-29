# LawLLMsTxt

**The `llms.txt` directory for U.S. law firms.** A public data layer between AI
systems and law firms' `llms.txt` files — so AI assistants can access accurate,
structured, verified information about each firm.

LawLLMsTxt is a **directory / open dataset**. It is *not* attorney advertising,
*not* a lawyer referral service, and *not* legal advice. A listing is not an
endorsement.

## How it works

1. A firm submits via the **Submit** form. The form builds a JSON record and
   opens a **pre-filled GitHub pull request** — there is no backend or database.
2. A GitHub Action (`.github/workflows/validate.yml`) automatically checks the
   record against the schema and confirms the `llms.txt` file is live.
3. A maintainer **verifies the firm's bar record** (see `docs/VERIFICATION.md`)
   and merges the PR.
4. On merge, the site rebuilds and a **static, crawlable page** is generated for
   the firm (`/firm/<slug>`), plus the firm appears in the site's own
   `/llms.txt` index.

Because every page is statically generated, the content is present in the raw
HTML — readable by search engines and AI fetchers **without** running JavaScript.
This is the core design choice that makes the directory genuinely AI-accessible.

## Tech stack

- **Next.js (App Router)** + **TypeScript** — static generation for crawlability
- **Tailwind CSS** — styling
- **Data as JSON files** in `data/firms/` — open, version-controlled, GitHub PR-based
- **GitHub Actions** — automated validation of every submission
- **Vercel** — recommended hosting (free static hosting)

No database. No server-side state. The dataset *is* the GitHub repo.

## Project structure

```
app/                 Next.js routes
  page.tsx           Directory index (static, filterable)
  firm/[slug]/       Static firm detail pages
  submit/            Submission form (opens a GitHub PR)
  llms.txt/route.ts  Site's own llms.txt, generated from the data
components/           UI components
data/
  firms/*.json       One file per firm (the dataset)
  taxonomy/          Practice areas + jurisdictions (controlled vocabularies)
lib/                 Types + data loading
scripts/             CI validation script
docs/                Schema, form spec, verification process
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run validate   # validate firm records against schema + taxonomy
```

## Before going live

- Set `GITHUB_OWNER` / `GITHUB_REPO` in `app/submit/page.tsx`.
- Set your deployed domain in `app/llms.txt/route.ts`.
- Review attorney-advertising / referral-service rules with a lawyer (rules are
  state-specific). The disclaimers are in `components/Disclaimer.tsx` and the
  footer.

## Docs

- [`docs/SCHEMA.md`](docs/SCHEMA.md) — data schema (fields, types, public vs internal)
- [`docs/FORM_SPEC.md`](docs/FORM_SPEC.md) — submission form spec
- [`docs/VERIFICATION.md`](docs/VERIFICATION.md) — how bar verification works
