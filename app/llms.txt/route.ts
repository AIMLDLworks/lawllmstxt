import { getAllFirms, practiceLabel, jurisdictionName } from "@/lib/firms";

// Serves LawLLMsTxt's own llms.txt at /llms.txt — a clean, machine-readable
// index of every listed firm, generated from the data files.
export const dynamic = "force-static";

export function GET() {
  const firms = getAllFirms();
  const base = "https://lawllmstxt.com"; // update to your deployed domain

  const lines: string[] = [
    "# LawLLMsTxt",
    "",
    "> The llms.txt directory for U.S. law firms. A public data layer that lets AI systems access accurate, structured information about law firms via their llms.txt files.",
    "",
    "This file lists firms indexed by LawLLMsTxt. Each entry links to the firm's own llms.txt. LawLLMsTxt is a directory, not attorney advertising, a referral service, or legal advice.",
    "",
    "## Firms",
    "",
  ];

  for (const f of firms) {
    const areas = f.practiceAreas.map(practiceLabel).join(", ");
    const juris = f.jurisdictions.map(jurisdictionName).join(", ");
    lines.push(
      `- [${f.firmName}](${base}/firm/${f.slug}): ${areas} — ${juris}. llms.txt: ${f.llmsTxtUrl}`
    );
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
