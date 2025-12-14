import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: '*.shutterstock.com', // For subdomain variations
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // ImageBB
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com', // Pixabay
      },
    ],
  },
};

export default nextConfig;
