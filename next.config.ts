import type { NextConfig } from 'next'

const STORE_STOREFRONT_URL =
  process.env.STORE_STOREFRONT_URL ??
  'https://store-storefront-git-develop-realkyrs-projects.vercel.app'

const NEKOWINK_STOREFRONT_URL =
  process.env.NEKOWINK_STOREFRONT_URL ??
  'https://nekowink-storefront.vercel.app'

// Fleur Vive has no production deployment yet, so production deliberately gets
// no default: without FLEURVIVE_STOREFRONT_URL set there, www.likqmusic.com
// /fleurvive stays a 404 rather than quietly rewriting a public path to a dev
// storefront. Set the variable in production once there is one to point at.
const FLEURVIVE_STOREFRONT_URL =
  process.env.FLEURVIVE_STOREFRONT_URL ??
  (process.env.VERCEL_ENV === 'production'
    ? null
    : 'https://fleurvive-storefront-git-develop-realkyrs-projects.vercel.app')

const CAPYBARA_URL =
  process.env.CAPYBARA_URL ??
  (process.env.VERCEL_ENV === 'production'
    ? 'https://capybara-quiz.dh885srk7b.workers.dev'
    : 'https://capybara-quiz-preview.dh885srk7b.workers.dev')

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
    const rewrites = [
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
      },
      {
        source: '/capybara',
        destination: `${CAPYBARA_URL}/capybara`
      },
      {
        source: '/capybara/:path*',
        destination: `${CAPYBARA_URL}/capybara/:path*`
      }
    ]

    if (FLEURVIVE_STOREFRONT_URL) {
      rewrites.push(
        {
          source: '/fleurvive',
          destination: `${FLEURVIVE_STOREFRONT_URL}/fleurvive`
        },
        {
          source: '/fleurvive/:path*',
          destination: `${FLEURVIVE_STOREFRONT_URL}/fleurvive/:path*`
        }
      )
    }

    return rewrites
  }
}

export default nextConfig
