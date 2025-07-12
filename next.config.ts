import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ['cdn.vectorstock.com', 'gateway.pinata.cloud'],
  },
  // Remove or adjust experimental.serverActions if not needed or not compatible
};

export default nextConfig;
