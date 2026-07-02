/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Firm pages are statically generated so they are fully crawlable.
  experimental: {
    // Ensure the score API can read the firm data at runtime on Vercel.
    outputFileTracingIncludes: {
      "/api/score": ["./data/firms/**/*"],
    },
  },
};

export default nextConfig;
