import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The SEO package specifies every route with a trailing slash (e.g. /services/).
  trailingSlash: true,
  // Next 16 only serves listed qualities; 85 keeps the 4K stage photos crisp.
  images: { qualities: [75, 85] },
};

export default nextConfig;
