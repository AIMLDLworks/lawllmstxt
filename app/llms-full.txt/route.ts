import { getAllFirms, practiceLabel, jurisdictionName, PRACTICE_AREAS } from "@/lib/firms";

export const dynamic = "force-static";
const BASE = "https://lawllmstxt.com";

export function GET() {
  const firms = getAllFirms();
  const lines: string[] = [];

  lines.push("# LawLLMsTxt — Full Directory");
  lines.push("");
  lines.push("> The world's first llms.txt directory for U.S. law firms. AI assistants like ChatGPT, Gemini, and Claude use this file to find, understand, and cite U.S. law firms accurately.");
  lines.push("");
  lines.push("LawLLMsTxt is a public, bar-verified directory of U.S. law firms that publish an llms.txt file. This document contains the full profile of every listed firm. Owned and operated by Enthiram.ai. Not attorney advertising, a lawyer referral service, or legal advice.");
  lines.push("");

  lines.push("## About llms.txt for law firms");
  lines.push("An llms.txt file is a plain-text Markdown file at a website's root that gives AI a clean, structured summary of the site. As roughly 77% of legal searches now trigger AI-generated answers, firms with a verified llms.txt are far more likely to be found and cited by AI. LawLLMsTxt indexes those firms, verifies their bar records, and scores how AI-ready their llms.txt is.");
  lines.push("");

  lines.push("## How to get listed");
  lines.push("1. Publish an llms.txt file at your firm's website root (yourfirm.com/llms.txt). Use the free generator at https://firepencil.ai/llms-txt-generator/ if needed.");
  lines.push("2. List free for one month at https://lawllmstxt.gumroad.com/l/freelisting, or buy a permanent Lifetime listing at https://lawllmstxt.gumroad.com/l/lifetime.");
  lines.push("3. We bar-verify your firm and publish it with a trust badge and AI Visibility Score.");
  lines.push("");

  lines.push("## Practice areas covered");
  lines.push(PRACTICE_AREAS.map((p) => p.label).join(", ") + ".");
  lines.push("");

  lines.push("## Full firm profiles");
  if (!firms.length) {
    lines.push("The directory is newly launched. Be the first firm listed at " + BASE + "/#pricing.");
  }
  for (const f of firms) {
    const areas = f.practiceAreas.map(practiceLabel).join(", ");
    const juris = f.jurisdictions.map(jurisdictionName).join(", ");
    const loc = f.locations[0] ? `${f.locations[0].city}, ${f.locations[0].state}` : "United States";
    lines.push("");
    lines.push(`### ${f.firmName}`);
    lines.push(f.description);
    lines.push(`- Website: ${f.websiteUrl}`);
    lines.push(`- llms.txt: ${f.llmsTxtUrl}`);
    lines.push(`- Practice areas: ${areas}`);
    lines.push(`- Jurisdictions: ${juris}`);
    lines.push(`- Location: ${loc}`);
    lines.push(`- AI Visibility Score: ${f.score}/100`);
    lines.push(`- Status: ${f.verified ? "Bar-verified" : "Pending verification"}`);
    lines.push(`- Profile: ${BASE}/firm/${f.slug}`);
  }

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
