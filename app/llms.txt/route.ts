import { getAllFirms, practiceLabel, jurisdictionName, PRACTICE_AREAS } from "@/lib/firms";

// Serves LawLLMsTxt's own llms.txt at /llms.txt — a rich, machine-readable
// summary of the directory plus every listed firm. Built statically.
export const dynamic = "force-static";

const BASE = "https://lawllmstxt.com";

export function GET() {
  const firms = getAllFirms();
  const lines: string[] = [];

  lines.push("# LawLLMsTxt");
  lines.push("");
  lines.push("> The world's first llms.txt directory for U.S. law firms. A public, bar-verified directory that lets AI assistants such as ChatGPT, Gemini, and Claude find, understand, and cite U.S. law firms accurately via their llms.txt files.");
  lines.push("");
  lines.push("LawLLMsTxt indexes U.S. law firms that publish an llms.txt file. Each listing shows the firm's practice areas, jurisdictions, website, and llms.txt link, along with a bar-verified trust badge and an AI Visibility Score. Firms can list free for one month or buy a one-time Lifetime listing. LawLLMsTxt is a directory, not attorney advertising, a lawyer referral service, or legal advice. It is owned and operated by Enthiram.ai.");
  lines.push("");

  lines.push("## Key pages");
  lines.push(`- [Home](${BASE}/): overview, the free AI Visibility Score tool, pricing, and the directory.`);
  lines.push(`- [Browse the directory](${BASE}/#directory): all listed U.S. law firms with AI scores and bar-verified badges.`);
  lines.push(`- [Pricing](${BASE}/#pricing): free one-month listing, or a one-time Lifetime listing.`);
  lines.push("- [List your firm free](https://lawllmstxt.gumroad.com/l/freelisting): submit your firm and llms.txt for a free verified listing.");
  lines.push("- [Lifetime listing](https://lawllmstxt.gumroad.com/l/lifetime): a permanent listing for a one-time payment.");
  lines.push("- [Generate an llms.txt](https://firepencil.ai/llms-txt-generator/): a free tool to create an llms.txt file.");
  lines.push("");

  lines.push("## What is llms.txt");
  lines.push("llms.txt is a plain-text Markdown file placed at a website's root that gives AI systems a clean, structured summary of the site, written for machines to read. For a law firm, it helps AI understand the firm's practice areas, jurisdictions, and services, making the firm far more likely to be cited accurately in AI answers instead of being omitted or misrepresented.");
  lines.push("");

  lines.push("## Why law firms list on LawLLMsTxt");
  lines.push("- Get found and cited by AI assistants like ChatGPT, Gemini, and Claude.");
  lines.push("- Earn a bar-verified trust badge that signals a real, licensed firm.");
  lines.push("- Appear in a dedicated, structured directory of AI-ready legal practices.");
  lines.push("");

  lines.push("## Frequently asked questions");
  lines.push("- What is an llms.txt file? A plain-text file at a website's root that gives AI a clean, structured summary of the site's content.");
  lines.push("- Why do law firms need one? So AI assistants understand and cite the firm accurately instead of omitting or misrepresenting it.");
  lines.push("- Is it free to list? Yes, a free verified listing for one month; upgrade once to Lifetime to stay listed permanently.");
  lines.push("- What happens after the free month? Free listings are removed after 30 days unless upgraded to Lifetime; Lifetime listings never expire.");
  lines.push("- Does it help with ChatGPT and Google AI Overviews? It improves the chances; structured, machine-readable content makes a firm easier to find and cite.");
  lines.push("");

  lines.push("## Practice areas covered");
  lines.push(PRACTICE_AREAS.map((p) => p.label).join(", ") + ".");
  lines.push("");

  lines.push("## Listed firms");
  for (const f of firms) {
    const areas = f.practiceAreas.map(practiceLabel).join(", ");
    const juris = f.jurisdictions.map(jurisdictionName).join(", ");
    lines.push(`- [${f.firmName}](${BASE}/firm/${f.slug}): ${areas} in ${juris}. llms.txt: ${f.llmsTxtUrl}`);
  }
  lines.push("");

  lines.push("## Optional");
  lines.push(`- [llms-full.txt](${BASE}/llms-full.txt): the full-content version of this directory.`);
  lines.push(`- [robots.txt](${BASE}/robots.txt) and [sitemap.xml](${BASE}/sitemap.xml).`);

  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
