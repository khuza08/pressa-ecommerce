import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
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
