import type { MetadataRoute } from "next";
import { getAllFirms } from "@/lib/firms";

const BASE = "https://lawllmstxt.com"; // update to your live domain if different

// Lists every page so search engines can discover and index them.
export default function sitemap(): MetadataRoute.Sitemap {
  const firms = getAllFirms();
  const firmPages = firms.map((f) => ({
    url: `${BASE}/firm/${f.slug}`,
    lastModified: new Date(f.lastVerified ?? f.dateAdded),
  }));

  return [
    { url: BASE, lastModified: new Date() },
    ...firmPages,
  ];
}
