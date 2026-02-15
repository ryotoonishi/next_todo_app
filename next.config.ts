import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add external hostnames you use with next/image
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "*.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "deviceinfo.blob.core.windows.net",
      },
    ],
  },
  /* other config options here */
};

export default nextConfig;
