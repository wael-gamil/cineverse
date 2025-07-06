import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/w500/**',
      },
    ],
    //todo:remove it in production
    unoptimized: true,
  },
};

export default nextConfig;
