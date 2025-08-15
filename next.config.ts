import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import pkg from './package.json' with { type: 'json' };
import { WebpackConfigContext } from "next/dist/server/config-shared";

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'intuipay.xyz',
        pathname: '/images/**',
      },
    ],
    unoptimized: true,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  webpack: (config: WebpackConfigContext) => {
    config.module.rules.push({
      test: /\.md$/i,
      type: 'asset/source',
    })
    return config
  },
  transpilePackages: ["@intuipay/shared"],
};

export default nextConfig;

initOpenNextCloudflareForDev();
