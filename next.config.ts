import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import pkg from './package.json' with { type: 'json' };
import { WebpackConfigContext } from "next/dist/server/config-shared";
import createMDX from '@next/mdx';
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compress: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
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
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["@intuipay/shared"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      ['remark-toc', { heading: 'toc' }],
    ],
    rehypePlugins: [
      'rehype-slug',
    ],
  },
});

export default withMDX(nextConfig);

initOpenNextCloudflareForDev();
