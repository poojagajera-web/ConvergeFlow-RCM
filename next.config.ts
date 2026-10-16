import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The SEO package specifies every route with a trailing slash (e.g. /services/).
  trailingSlash: true,
};

export default nextConfig;
