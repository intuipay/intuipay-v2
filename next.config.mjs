import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: 'example.com',
        pathname: '/images/**',
      },
    ],
    unoptimized: true,
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;

if (process.env.NODE_ENV === 'development') {
  // we simply need to call the utility
  setupDevPlatform();
}
