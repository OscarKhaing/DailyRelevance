import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // enables fast, cancellable streaming responses
  },
};

export default nextConfig;
