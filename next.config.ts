import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  basePath: "/resource-sharing-frontend",
  assetPrefix: "/resource-sharing-frontend/",
   images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      // Add other external image hosts here as needed
      // { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
