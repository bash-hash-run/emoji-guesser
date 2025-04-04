import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Optional: Add basePath if you're not deploying to the root of your domain
  // basePath: '/my-app',
  // Optional: Disable image optimization if you don't need it
  images: { unoptimized: true },
};

export default nextConfig;
