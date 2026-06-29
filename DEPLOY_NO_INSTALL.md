# Run, Test & Deploy — No Installs (GitHub + Vercel)

This path uses **nothing on your computer** except a web browser. All the heavy
stuff (Node.js, building, `node_modules`) happens on free cloud servers. You test
on a real live website URL.

> Good to know: your `lawllmtxt` folder right now is small because the big
> `node_modules` folder doesn't exist yet — you never installed it. That's
> correct. The cloud creates it for you. Never upload `node_modules`.

---

## Step 1 — Create a free GitHub account

1. Go to https://github.com and sign up (email + password). It's free.
2. Verify your email when GitHub asks.

---

## Step 2 — Create an empty repository

1. Go to https://github.com/new
2. **Repository name:** `lawllmtxt`
3. Keep it **Public**.
4. Do **NOT** tick "Add a README" (leave all boxes unchecked).
5. Click **Create repository**.

You'll land on a page that says "Quick setup". Leave it open.

---

## Step 3 — Upload your files (drag-and-drop, no Git)

1. On that repo page, click the link **"uploading an existing file"**
   (or go to `https://github.com/YOUR-USERNAME/lawllmtxt/upload/main`).
2. Open **File Explorer** and go to:
   `D:\LLMs txt directory Ganga\lawllmtxt`
3. Select **everything inside** the folder:
   - Click an empty area, press **Ctrl + A** to select all files and folders.
   - **Important:** select the *contents* (app, components, data, docs, etc.),
     **not** the `lawllmtxt` folder itself.
4. **Drag** the selected items onto the GitHub upload page (the big drop area).
5. Wait for the file list to finish loading (you'll see them listed).
6. Scroll down, leave the message as-is, click **Commit changes**.

Refresh the repo page — you should see all your folders (`app`, `components`,
`data`, `docs`, etc.) and files there.

> If drag-and-drop of folders misbehaves in your browser, use **Chrome** or
> **Edge**, which handle folder uploads well. You can also upload folder by
> folder if needed.

---

## Step 4 — Deploy on Vercel (this is your "run")

1. Go to https://vercel.com and click **Sign Up → Continue with GitHub**.
   Approve the access GitHub asks for.
2. Click **Add New… → Project**.
3. Find your `lawllmtxt` repo in the list and click **Import**.
4. Don't change any settings — Vercel detects Next.js automatically.
5. Click **Deploy**.
6. Wait ~1–2 minutes while it builds in the cloud.
7. You get a live URL like `https://lawllmtxt-xxxx.vercel.app`.

**Open that URL — that is your running, testable website.** No local server needed.

---

## Step 5 — Test it (in your browser)

On your live URL, check:

- The homepage shows the two example firms.
- Clicking a **practice-area filter** filters the list.
- Clicking a **firm card** opens its detail page.
- Add `/submit` to the URL — the submission form loads.
- Add `/llms.txt` to the URL — the machine-readable index loads.

**Data validation runs automatically in the cloud.** Every time you change a file
in `data/firms/`, GitHub's built-in check (the Action we set up) validates it for
you — you don't need to run anything locally. See the **Actions** tab on your
GitHub repo for results (green check = good).

---

## Step 6 — Final config (edit files in the browser)

Two quick edits so the submit button and llms.txt point to your real site. You
edit right on GitHub — no tools needed.

1. On GitHub, open `app/submit/page.tsx`. Click the **pencil icon** (Edit).
   Change:
   ```ts
   const GITHUB_OWNER = "YOUR-USERNAME";
   const GITHUB_REPO  = "lawllmtxt";
   ```
   Click **Commit changes**.
2. Open `app/llms.txt/route.ts`, click the pencil, set your live URL:
   ```ts
   const base = "https://lawllmtxt-xxxx.vercel.app";
   ```
   Click **Commit changes**.

Each commit makes **Vercel redeploy automatically** within a minute. Refresh your
live URL to see updates.

---

## How you edit anything later (still no installs)

- **Quick edit:** click the pencil icon on any file in GitHub.
- **Full editor in the browser:** on your repo, press the **`.`** (period) key —
  this opens a complete VS Code editor in your browser (github.dev). Edit, then
  commit. Vercel redeploys.

---

## The everyday loop after launch

1. A firm uses your `/submit` form → it opens a pre-filled pull request on GitHub.
2. You open the **Pull requests** tab → the automatic check runs.
3. You verify their bar record (`docs/VERIFICATION.md`) → click **Merge**.
4. Vercel rebuilds automatically → the firm's page is live.

Everything is in the browser. Nothing is installed on your computer.

---

## Troubleshooting

- **Vercel build fails:** open the build log Vercel shows; usually it's a typo
  from a manual edit. Undo your last commit on GitHub (History → revert) and try
  again, or paste the red error to get help.
- **Upload missing the `.github` folder:** files/folders starting with a dot can
  be skipped by some browsers. The site still runs without it; you only lose the
  auto-validation check. You can add that folder later via github.dev.
- **Can't find your repo in Vercel:** in Vercel, go to settings and give it
  access to your GitHub repositories, then refresh the import list.
