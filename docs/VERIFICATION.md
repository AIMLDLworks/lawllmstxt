# Bar Verification

A "Bar-verified" badge is LawLLMsTxt's core trust signal. This explains what can be
automated, what can't, and the exact manual process.

## Can it be fully automated for all 50 states?

**Not for free or reliably.** There is no single national attorney-license API.
Each state runs its own lookup site, with different formats; some block scraping
and have restrictive terms. Two realistic paths:

1. **Paid aggregator API** — commercial services cover all 50 states and can make
   verification effectively automatic, at a per-lookup cost. Best once volume
   justifies it.
2. **Semi-automatic (recommended for v1)** — auto-verify the high-volume states,
   manual for the rest.

## What IS fully automated (v1)

- **llms.txt validation** — the GitHub Action checks the file is live and the
  record matches the schema on every PR. No human needed.

## Semi-automatic bar checks

Ready-made scrapers/APIs exist for the largest states (California, Texas, New
York, Florida). A maintainer (or a CI helper) can run a lookup by bar number and
post the result as a PR comment. Start with these four; add states over time.

## Manual verification process (the long tail)

When a submission PR arrives:

1. Open the relevant **state bar public lookup** (e.g., the State Bar of
   California / Texas / your state's site).
2. Search by the submitted **bar number** (or attorney name).
3. Confirm:
   - License **status = Active** (not suspended/disbarred/inactive).
   - **Name / firm** reasonably matches the submission.
   - No disqualifying disciplinary status.
4. In the firm's JSON, set:
   ```json
   "status": "verified",
   "verified": true,
   "verifiedDate": "<today, ISO>",
   "verificationSource": "<URL of the bar lookup used>",
   "lastVerified": "<today, ISO>"
   ```
5. Assign the next `id` (`LX-00000N`) and merge the PR.

If the firm can't be verified, set `status` to `pending` (leave unverified and
unbadged) or `rejected`, and explain in the PR.

## Re-verification (keeping trust fresh)

Schedule a periodic job (e.g., GitHub Action on a cron) to:

- Re-check each `llms.txt` is still live; if not, set `status: "broken"`.
- Re-run bar checks for verified firms on a cadence (e.g., annually) and update
  `lastVerified`.

## Important

Verification reflects a public-record check **on a date** — it is not a guarantee
of competence or current standing. The disclaimer in
`components/Disclaimer.tsx` states this.
