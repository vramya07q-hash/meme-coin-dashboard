import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  allowedDevOrigins: [
    "172.17.48.1",
  ],
};

export default nextConfig;