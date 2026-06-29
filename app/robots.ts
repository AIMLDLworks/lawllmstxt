import type { MetadataRoute } from "next";

const BASE = "https://lawllmstxt.com"; // update to your live domain if different

// Tells search engines and crawlers everything is open, and points to the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
