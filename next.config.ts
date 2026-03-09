import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.likqmusic.com'
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com'
      }
    ]
  },
  async rewrites() {
    // Determine the environment-specific destination for the backoffice MFE
    const backofficeUrl = process.env.BACKOFFICE_URL || 'http://localhost:3001'
    return [
      {
        source: '/dashboard',
        destination: `${backofficeUrl}/dashboard`
      },
      {
        source: '/dashboard/:path*',
        destination: `${backofficeUrl}/dashboard/:path*`
      }
    ]
  }
}

export default nextConfig
