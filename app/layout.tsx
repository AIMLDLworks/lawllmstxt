import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LawLLMsTxt — the llms.txt directory for U.S. law firms",
  description:
    "A public directory of llms.txt files published by U.S. law firms, so AI systems can access accurate, structured information about each firm.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-bold text-brand">
              Law<span className="text-brand-accent">LLMstxt</span>
            </Link>
            <nav className="flex gap-5 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-brand">Directory</Link>
              <Link href="/submit" className="hover:text-brand">Submit a firm</Link>
              <Link href="/llms.txt" className="hover:text-brand">llms.txt</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-8 text-xs text-slate-500">
            <p className="mb-2 font-medium text-slate-600">Disclaimer</p>
            <p className="leading-relaxed">
              LawLLMsTxt is a public data directory of llms.txt files. It is not
              attorney advertising, not a lawyer referral service, and not legal
              advice. A listing is not an endorsement of any firm.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
