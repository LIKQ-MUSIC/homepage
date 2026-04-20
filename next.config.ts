import type { NextConfig } from 'next'

const STORE_STOREFRONT_URL =
  process.env.STORE_STOREFRONT_URL ??
  'https://store-storefront-git-develop-realkyrs-projects.vercel.app'

const NEKOWINK_STOREFRONT_URL =
  process.env.NEKOWINK_STOREFRONT_URL ??
  'https://nekowink-storefront.dh885srk7b.workers.dev'

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
  trailingSlash: false,
  async rewrites() {
    const backofficeUrl = (
      process.env.BACKOFFICE_URL || 'http://localhost:3001'
    ).replace(/\/$/, '')
    return [
      {
        source: '/dashboard',
        destination: `${backofficeUrl}/dashboard`
      },
      {
        source: '/dashboard/:path*',
        destination: `${backofficeUrl}/dashboard/:path*`
      },
      {
        source: '/merch',
        destination: `${STORE_STOREFRONT_URL}/merch`
      },
      {
        source: '/merch/:path*',
        destination: `${STORE_STOREFRONT_URL}/merch/:path*`
      },
      {
        source: '/nekowink',
        destination: `${NEKOWINK_STOREFRONT_URL}/nekowink`
      },
      {
        source: '/nekowink/:path*',
        destination: `${NEKOWINK_STOREFRONT_URL}/nekowink/:path*`
      }
    ]
  }
}

export default nextConfig
