# Data Schema

Each firm is one JSON file in `data/firms/<slug>.json`. The filename must match
the `slug`. Canonical types live in `lib/schema.ts`; the CI validator in
`scripts/validate-firms.mjs` enforces this.

## Fields

| Field | Type | Required | Public | Notes |
|-------|------|----------|--------|-------|
| `schemaVersion` | number | yes | yes | Currently `1`. |
| `id` | string | auto | yes | Stable LawLLMTxt ID, e.g. `LX-000001`. Assigned by maintainer on merge. |
| `slug` | string | yes | yes | URL slug; must equal the filename. |
| `firmName` | string | **yes** | yes | Display name. |
| `websiteUrl` | string (URL) | **yes** | yes | Canonical firm site. |
| `llmsTxtUrl` | string (URL) | **yes** | yes | The indexed `llms.txt` file. |
| `llmsFullTxtUrl` | string (URL) \| null | no | yes | Optional `llms-full.txt`. |
| `description` | string | **yes** | yes | 1–2 sentence summary. |
| `jurisdictions` | string[] | **yes** | yes | Codes from `taxonomy/jurisdictions.json`. |
| `practiceAreas` | string[] | **yes** | yes | Ids from `taxonomy/practice-areas.json`. |
| `locations` | {city,state}[] | no | yes | Office locations. |
| `firmSize` | enum | **yes** | yes | `solo` \| `small` \| `midsize` \| `large`. |
| `yearEstablished` | number \| null | no | yes | |
| `languages` | string[] | no | yes | |
| `feeModel` | enum[] | no | yes | `contingency` \| `hourly` \| `flat` \| `free-consultation`. |
| `barAdmissions` | object[] | no | **partial** | `{state, barNumber, attorneyName}`. Used for verification. Render only `attorneyName`/`state` publicly if desired; treat `barNumber` as low-sensitivity public record. |
| `score` | number | auto | yes | 0–100 best-practice score. |
| `status` | enum | auto | yes | `pending` \| `verified` \| `broken` \| `rejected`. |
| `verified` | boolean | auto | yes | Drives the "Bar-verified" badge. |
| `verifiedDate` | string \| null | auto | yes | ISO date of the bar check. |
| `verificationSource` | string \| null | auto | yes | URL of the bar lookup used. |
| `dateAdded` | string | auto | yes | ISO date. |
| `lastVerified` | string \| null | auto | yes | ISO date of last re-check. |
| `submitterEmail` | string | **yes** | **no — INTERNAL** | Never rendered or served publicly. Stripped by `lib/firms.ts`. |

## Public vs internal

`lib/firms.ts` strips `INTERNAL_FIELDS` (currently `submitterEmail`) before any
firm object is rendered or served. If you add private fields, add them to
`INTERNAL_FIELDS` in `lib/schema.ts`.

> Note: a record committed to a public GitHub repo is public regardless of UI
> stripping. Keep truly private data (like submitter email) out of the committed
> file if that matters — e.g. collect it via a separate channel rather than the
> PR body. The current scaffold includes it for completeness; remove it from the
> form output if you prefer.

## Best-practice score (0–100)

Suggested rubric (implement in a scoring step, e.g. on merge):

- llms.txt is live and valid Markdown — 30
- Has H1 + summary blockquote per spec — 15
- Has structured sections with described links — 15
- Provides `llms-full.txt` — 10
- Jurisdiction(s) clearly stated — 10
- Practice areas specified — 10
- Attorney-attributed / contact clarity — 10
