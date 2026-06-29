# Getting Started (Beginner Guide — Windows)

This guide takes you from nothing installed to a live website. Follow it in
order. Don't skip ahead. Each step says what to do and what you should see.

---

## Phase 0 — Install the tools you need (one time)

You need three free things. Install each, then restart your computer once at the end.

1. **Node.js** (runs the app)
   - Go to https://nodejs.org and download the **LTS** version.
   - Run the installer, click Next on everything, Finish.

2. **Git** (sends your code to GitHub)
   - Go to https://git-scm.com/download/win and download.
   - Run the installer, accept all defaults, Finish.

3. **A code editor — VS Code** (to view/edit files; optional but recommended)
   - Go to https://code.visualstudio.com and install.

4. **A GitHub account** (free) — sign up at https://github.com
5. **A Vercel account** (free) — sign up at https://vercel.com using
   "Continue with GitHub".

**Check it worked:** open the Start menu, type `cmd`, open **Command Prompt**, and run:

```
node -v
git --version
```

You should see version numbers (e.g. `v20.x.x`). If you see "not recognized",
restart your computer and try again.

---

## Phase 1 — Open the project in a terminal

1. Open **Command Prompt** (Start menu → type `cmd`).
2. Go to the project folder by pasting this and pressing Enter:

```
cd "D:\LLMs txt directory Ganga\lawllmtxt"
```

The line should now start with `D:\LLMs txt directory Ganga\lawllmtxt>`.

---

## Phase 2 — Install the app's building blocks

Run this once (it downloads everything the app needs — takes a few minutes):

```
npm install
```

You'll see a progress bar, then it finishes with a summary. A new `node_modules`
folder appears. (This folder is large and is never uploaded — that's normal.)

---

## Phase 3 — Run it on your own computer

```
npm run dev
```

You'll see: `Local: http://localhost:3000`.

Open a web browser and go to **http://localhost:3000**.
You should see the LawLLMTxt directory with two example firms.

To stop the app later: click the Command Prompt window and press **Ctrl + C**.

---

## Phase 4 — Test it

With the app running, click around:

- Click a **practice-area filter** (e.g. "Immigration") — the list filters.
- Click a **firm card** — you see its detail page at `/firm/...`.
- Go to **http://localhost:3000/submit** — try the form. Filling it and clicking
  the button would open a GitHub page (you can close it for now).
- Go to **http://localhost:3000/llms.txt** — you see the auto-generated
  machine-readable index.

**Validate your data** (checks every firm file is correct). Open a *second*
Command Prompt in the same folder (repeat Phase 1) and run:

```
npm run validate
```

You should see `All firm records valid.`

> If you ever add or edit a firm file in `data/firms/`, run `npm run validate`
> again to catch mistakes.

---

## Phase 5 — Put your code on GitHub

1. Go to https://github.com/new
2. **Repository name:** `lawllmtxt` (or any name). Leave it **Public**.
   Do **not** tick "Add a README". Click **Create repository**.
3. GitHub shows commands. Ignore them — use these instead. Back in Command
   Prompt (in the project folder), run these lines **one at a time**.
   Replace `YOUR-USERNAME` with your GitHub username:

```
git init
git add .
git commit -m "Initial LawLLMTxt directory"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lawllmtxt.git
git push -u origin main
```

The first time you push, a window may pop up asking you to sign in to GitHub —
do that. When it finishes, refresh your GitHub repo page; your files are there.

---

## Phase 6 — Deploy it live (free) with Vercel

1. Go to https://vercel.com and sign in with GitHub.
2. Click **Add New… → Project**.
3. Find your `lawllmtxt` repository and click **Import**.
4. Leave all settings as-is (Vercel auto-detects Next.js). Click **Deploy**.
5. Wait ~1–2 minutes. You'll get a live URL like
   `https://lawllmtxt-xxxx.vercel.app`. **That's your live website.**

---

## Phase 7 — Final configuration (so the live site is fully wired)

Two small edits make the submit button and llms.txt point to the right place.
You can edit files on GitHub directly (pencil icon) or in VS Code.

1. In `app/submit/page.tsx`, near the top, set:
   ```ts
   const GITHUB_OWNER = "YOUR-USERNAME";   // your GitHub username
   const GITHUB_REPO  = "lawllmtxt";        // your repo name
   ```
2. In `app/llms.txt/route.ts`, set your real domain:
   ```ts
   const base = "https://lawllmtxt-xxxx.vercel.app"; // your Vercel URL
   ```
3. Save. If editing on GitHub, click **Commit changes**. Vercel automatically
   redeploys within a minute. If editing locally, push the changes:
   ```
   git add .
   git commit -m "Configure repo and domain"
   git push
   ```

---

## How new firms get added after launch

1. A firm fills your `/submit` form → it opens a pre-filled pull request.
2. You get the pull request on GitHub. The automated check runs.
3. You verify their bar record (see `docs/VERIFICATION.md`) and click **Merge**.
4. Vercel rebuilds automatically and the firm's page goes live.

That's the whole loop. No servers to manage.

---

## If something goes wrong

- **`npm` or `node` not recognized:** restart your computer after installing Node.
- **`npm install` fails:** make sure you're in the right folder (Phase 1) and
  connected to the internet; run it again.
- **Port 3000 already in use:** stop other running apps, or it will offer
  another port — just open the URL it prints.
- **Push asks for a password and rejects it:** GitHub no longer accepts account
  passwords here; sign in through the pop-up window instead, or create a
  "Personal access token" in GitHub settings and paste that as the password.
