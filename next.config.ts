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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.sandbox.midtrans.com https://app.midtrans.com https://api.sandbox.midtrans.com https://api.midtrans.com https://snap-assets.al-pc-id-b.cdn.gtflabs.io https://pay.google.com https://gwk.gopayapi.com/sdk/stable/gp-container.min.js; connect-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com https://api.sandbox.midtrans.com https://api.midtrans.com http://localhost:8080 http://127.0.0.1:8080; img-src 'self' data: http://localhost:8080 http://127.0.0.1:8080 https://midtrans.com https://*.midtrans.com https://img.freepik.com https://www.shutterstock.com https://*.shutterstock.com https://placehold.co https://i.ibb.co https://images.unsplash.com https://cdn.pixabay.com https://lh3.googleusercontent.com https://*.googleusercontent.com; frame-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com https://pay.google.com;",
          },
        ],
      },
    ];
  },
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