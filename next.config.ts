import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'localhost:3000',
    'localhost:3001',
    'localhost:3002',
    '192.168.1.4:3000',
    '192.168.1.4:3001',
    '192.168.1.4:3002',
    '*.vercel.app'
  ],
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8080/uploads/:path*', // Proxy to backend
      },
    ];
  },
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
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google user content (profile pictures)
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // For any Google user content subdomains
      },
    ],
  },
};

export default nextConfig;