# Submission Form Spec

The form lives at `/submit` (`app/submit/page.tsx`). It is a client component
that collects firm details, builds a schema-valid JSON record, and opens a
**pre-filled GitHub pull request** (GitHub's `/new/<branch>?filename=&value=`
URL). No server, no database.

## Fields collected

| Field | Control | Required | Maps to schema field |
|-------|---------|----------|----------------------|
| Firm name | text | yes | `firmName` |
| Website URL | text | yes | `websiteUrl` |
| llms.txt URL | text | yes | `llmsTxtUrl` |
| Short description | textarea | yes | `description` |
| Jurisdiction(s) | multi-select chips | yes | `jurisdictions` |
| Practice area(s) | multi-select chips | yes | `practiceAreas` |
| Firm size | select | no (default `small`) | `firmSize` |
| Bar state / number / attorney | text x3 | no (needed for verification) | `barAdmissions[0]` |
| Contact email | text | no | `submitterEmail` |

Required fields are enforced client-side before the submit button enables.
The CI validator re-enforces them on the PR.

## Controlled vocabularies

- Jurisdictions come from `data/taxonomy/jurisdictions.json` (50 states + DC + Federal).
- Practice areas come from `data/taxonomy/practice-areas.json`.

Using fixed lists (not free text) is what makes filtering and AI relevance work.

## Configuration

Set these constants at the top of `app/submit/page.tsx`:

```ts
const GITHUB_OWNER = "your-org";
const GITHUB_REPO = "lawllmstxt";
const GITHUB_BRANCH = "main";
```

## Flow

1. User fills the form.
2. `Open pull request on GitHub` builds `data/firms/<slug>.json` and opens the
   GitHub new-file editor pre-filled with the JSON.
3. User commits → GitHub opens a PR.
4. CI validates; maintainer verifies bar record and merges.

## Optional upgrade (later)

Replace the pre-filled-URL flow with **GitHub OAuth + the GitHub API** to open
the PR programmatically (smoother UX), or a small serverless function. Not needed
for v1.
