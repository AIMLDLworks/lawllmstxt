/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Firm pages are statically generated so they are fully crawlable by
  // search engines and AI fetchers (no JavaScript required to read content).
};

export default nextConfig;
