import Link from "next/link";
import type { PublicFirm } from "@/lib/firms";
import { practiceLabel, jurisdictionName } from "@/lib/firms";

export default function FirmCard({ firm }: { firm: PublicFirm }) {
  return (
    <Link
      href={`/firm/${firm.slug}`}
      className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-brand-accent hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-brand">{firm.firmName}</h3>
        {firm.verified && (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            Bar-verified
          </span>
        )}
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{firm.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {firm.practiceAreas.slice(0, 3).map((p) => (
          <span key={p} className="rounded bg-brand-light px-2 py-0.5 text-xs text-brand">
            {practiceLabel(p)}
          </span>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-400">
        {firm.jurisdictions.map(jurisdictionName).join(", ")}
      </div>
    </Link>
  );
}
