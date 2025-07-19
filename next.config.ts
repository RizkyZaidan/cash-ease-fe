import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost:3000',
        pathname: '/_next/image/**',
      },
    ],
  },
  env: {
    NEXT_CONFIG_URL_API: process.env.NEXT_PUBLIC_URL_API,
    NEXT_CONFIG_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_CONFIG_IDB_ENCRYPTION_KEY: process.env.NEXT_PUBLIC_IDB_ENCRYPTION_KEY,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
