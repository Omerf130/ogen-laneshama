import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/site-media/**",
      },
    ],
  },
};

export default nextConfig;
