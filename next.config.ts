import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        hostname: "ska1uulvzpaiyhln.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
