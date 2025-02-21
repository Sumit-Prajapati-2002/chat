/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://23.132.28.30:8000/:path*',
      },
    ];
  },
  reactStrictMode: true,
  swcMinify: true
}

export default nextConfig
