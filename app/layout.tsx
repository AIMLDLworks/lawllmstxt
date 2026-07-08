import type { Metadata } from "next";
import Link from "next/link";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://lawllmstxt.com"),
  title: "LawLLMsTxt - the world's first llms.txt directory for U.S. law firms",
  description:
    "The first public directory of llms.txt files for U.S. law firms, so AI assistants like ChatGPT, Gemini, and Claude can find, understand, and cite your firm accurately.",
  keywords: ["llms.txt", "law firm directory", "AI visibility", "GEO", "AEO", "legal AI", "ChatGPT law firm", "attorney directory"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://lawllmstxt.com",
    siteName: "LawLLMsTxt",
    title: "The world's first llms.txt directory for U.S. law firms",
    description: "Get your law firm found and cited by AI assistants like ChatGPT, Gemini, and Claude.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The world's first llms.txt directory for U.S. law firms",
    description: "Get your law firm found and cited by AI assistants like ChatGPT, Gemini, and Claude.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
            <Link href="/" className="text-xl font-bold tracking-tight text-brand">
              Law<span className="text-brand-accent">LLMstxt</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
              <Link href="/#directory" className="hover:text-brand">Directory</Link>
              <Link href="/#pricing" className="rounded-lg bg-brand px-3.5 py-2 text-white transition hover:bg-brand-accent">
                List your firm
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="mt-20 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500">
            <p className="mb-2 font-medium text-slate-600">Disclaimer</p>
            <p className="max-w-3xl leading-relaxed">
              LawLLMsTxt is a public data directory of llms.txt files. It is not attorney
              advertising, not a lawyer referral service, and not legal advice. A listing is
              not an endorsement of any firm.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
