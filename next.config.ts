/** @type {import('next').NextConfig} */
const nextConfig = {
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
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.sandbox.midtrans.com https://app.midtrans.com https://api.sandbox.midtrans.com https://api.midtrans.com https://snap-assets.al-pc-id-b.cdn.gtflabs.io https://pay.google.com https://js-agent.newrelic.com https://bam.nr-data.net https://gwk.gopayapi.com/sdk/stable/gp-container.min.js;",
              "connect-src 'self' http://localhost:8080 http://127.0.0.1:8080 https://app.sandbox.midtrans.com https://app.midtrans.com https://api.sandbox.midtrans.com https://api.midtrans.com https://js-agent.newrelic.com https://bam.nr-data.net https://gwk.gopayapi.com;",
              "img-src 'self' data: http://localhost:8080 http://127.0.0.1:8080 https://midtrans.com https://*.midtrans.com https://img.freepik.com https://www.shutterstock.com https://*.shutterstock.com https://placehold.co https://i.ibb.co https://images.unsplash.com https://cdn.pixabay.com https://lh3.googleusercontent.com https://*.googleusercontent.com https:;",
              "style-src 'self' 'unsafe-inline';",
              "font-src 'self';",
              "frame-src 'self' https://app.sandbox.midtrans.com https://app.midtrans.com https://pay.google.com;"
            ].join(' ')
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
      { protocol: 'https', hostname: 'img.freepik.com' },
      { protocol: 'https', hostname: 'www.shutterstock.com' },
      { protocol: 'https', hostname: '*.shutterstock.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'http', hostname: 'localhost', port: '8080', pathname: '/uploads/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8080', pathname: '/uploads/**' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
};

module.exports = nextConfig;
