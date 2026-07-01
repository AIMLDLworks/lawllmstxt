// Runs daily via GitHub Actions.
// 1) Emails free listings nearing expiry (7, 3, 1 days left) to nudge a Lifetime upgrade.
// 2) Deletes free listings that have expired; the resulting commit triggers a redeploy.
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "data", "firms");
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "LawLLMsTxt <onboarding@resend.dev>";
const SITE_URL = process.env.SITE_URL || "https://lawllmstxt.com";
const GUMROAD_URL = process.env.GUMROAD_URL || "https://yourname.gumroad.com/l/lawllmstxt-lifetime";
const PRICE = process.env.LIFETIME_PRICE || "$49";
const REMIND_DAYS = [7, 3, 1];

function daysLeft(expiresAt) {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt + "T23:59:59Z").getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}

function emailHtml(firmName, d) {
  const dayWord = d === 1 ? "day" : "days";
  return [
    '<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#1f2937">',
    '<h2 style="color:#1F3A5F">Your firm is about to be removed from LawLLMsTxt</h2>',
    "<p>Hi,</p>",
    "<p><strong>" + firmName + "</strong> is currently listed for free on <strong>LawLLMsTxt</strong>, the llms.txt directory for U.S. law firms that helps AI assistants like ChatGPT and Google AI find and cite your firm accurately.</p>",
    '<p style="background:#fef3c7;border-radius:8px;padding:12px 14px"><strong>Your free listing ends in ' + d + " " + dayWord + ".</strong> After that, your firm will be removed and will no longer appear to AI systems searching for firms like yours.</p>",
    "<p>Keep your firm listed permanently with a one-time <strong>Lifetime</strong> listing (" + PRICE + "):</p>",
    '<p><a href="' + GUMROAD_URL + '" style="display:inline-block;background:#1F3A5F;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold">Upgrade to Lifetime for ' + PRICE + "</a></p>",
    '<p style="font-size:12px;color:#6b7280">View your listing: <a href="' + SITE_URL + '">' + SITE_URL + "</a><br/>You are receiving this because your firm was submitted to LawLLMsTxt.</p>",
    "</div>",
  ].join("");
}

async function sendEmail(to, firmName, d) {
  if (!RESEND_API_KEY) { console.log("No RESEND_API_KEY set; skipping email to", to); return; }
  if (!to) { console.log("No email on record for", firmName); return; }
  const dayWord = d === 1 ? "day" : "days";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject: "Action needed: " + firmName + " will be removed from LawLLMsTxt in " + d + " " + dayWord,
      html: emailHtml(firmName, d),
    }),
  });
  if (!res.ok) console.log("Email failed for", to, res.status, await res.text());
  else console.log("Reminder sent to", to, "(" + d + "d left)");
}

const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".json")) : [];
let removed = 0, reminded = 0;

for (const file of files) {
  const p = path.join(DIR, file);
  let firm;
  try { firm = JSON.parse(fs.readFileSync(p, "utf8")); } catch { continue; }
  if (firm.plan !== "free" || !firm.expiresAt) continue; // lifetime and unlimited are untouched
  const d = daysLeft(firm.expiresAt);
  if (d === null) continue;
  if (d < 0) {
    fs.unlinkSync(p);
    removed++;
    console.log("Removed expired free listing:", file);
    continue;
  }
  if (REMIND_DAYS.includes(d)) {
    await sendEmail(firm.submitterEmail, firm.firmName, d);
    reminded++;
  }
}

console.log("Done. Reminders sent:", reminded, "| Expired listings removed:", removed);
