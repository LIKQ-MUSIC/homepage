import Navbar from '@/components/Navbar'
import Works from '@/components/Works'
import Team from '@/components/Team'
import Footer from '@/components/Footer'
import BlogSection from '@/components/BlogSection'
import HeroVideo from '@/components/home/HeroVideo'
import AboutSplit from '@/components/home/AboutSplit'
import TrackListServices from '@/components/home/TrackListServices'
import CandidateRail from '@/components/home/CandidateRail'
import ColorBand from '@/components/home/ColorBand'
import AuditionBand from '@/components/home/AuditionBand'
import SeasonalDropSection from '@/components/SeasonalDropSection'
import type { SeasonalDropTier, SeasonalDropImage } from '@/components/SeasonalDropSection'
import { getAboutUsImages } from '@/services/about-us'

import type { Metadata } from 'next'
import { IWorkItem } from '@/components/Works/types'

export const revalidate = 3600 // Verify static rebuild every hour if revalidated

export async function generateMetadata(): Promise<Metadata> {
  const images = await getAboutUsImages()
  const firstImage = images?.[0]?.image_url

  if (!firstImage) return {}

  return {
    openGraph: {
      images: [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: 'LiKQ MUSIC'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      images: [firstImage]
    }
  }
}

async function getWorks(): Promise<IWorkItem[]> {
  const url = process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3002'
  try {
    const res = await fetch(`${url}/works`, {
      next: { tags: ['works'] }
    })
    if (!res.ok) return []
    const json = await res.json()

    return (json.data || []).map((item: any) => ({
      title: item.title,
      category: item.category,
      description: item.description,
      image: item.image_url || '',
      youtubeId: item.youtube_id,
      url: item.external_url,
      start: item.start_date || undefined,
      end: item.end_date || undefined,
      location: item.location
    }))
  } catch (error) {
    console.error('Failed to fetch works for SSG:', error)
    return []
  }
}

async function getSeasonalDropTiers(): Promise<SeasonalDropTier[]> {
  const url = process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3002'
  try {
    const res = await fetch(`${url}/seasonal-drops/tiers`, {
      next: { tags: ['seasonal-drop-tiers'] }
    })
    if (!res.ok) return []
    const json = await res.json()
    return (json.data || [])
      .filter((t: SeasonalDropTier) => t.is_active)
      .sort((a: SeasonalDropTier, b: SeasonalDropTier) => a.display_order - b.display_order)
  } catch (error) {
    console.error('Failed to fetch seasonal drop tiers:', error)
    return []
  }
}

async function getSeasonalDropImages(): Promise<SeasonalDropImage[]> {
  const url = process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3002'
  try {
    const res = await fetch(`${url}/seasonal-drops/images`, {
      next: { tags: ['seasonal-drop-images'] }
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error('Failed to fetch seasonal drop images:', error)
    return []
  }
}

async function getLatestBlogs() {
  const url = process.env.NEXT_PUBLIC_GATEWAY_API_URL || 'http://localhost:3002'
  try {
    const res = await fetch(`${url}/blogs/public?limit=3`, {
      next: { tags: ['blogs'] }
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (error) {
    console.error('Failed to fetch blogs for homepage:', error)
    return []
  }
}

export default async function Home() {
  const [worksData, latestPosts, seasonalDropTiers, seasonalDropImages] = await Promise.all([
    getWorks(),
    getLatestBlogs(),
    getSeasonalDropTiers(),
    getSeasonalDropImages(),
  ])

  return (
    <main className="min-h-screen bg-ink-deep text-ink-text font-sans overflow-x-hidden">
      <Navbar tone="dark" />
      <HeroVideo />

      <AboutSplit />

      <TrackListServices />

      <CandidateRail />

      {worksData.length > 0 && <Works items={worksData} />}

      <ColorBand />

      {seasonalDropTiers.length > 0 && (
        <SeasonalDropSection initialTiers={seasonalDropTiers} initialImages={seasonalDropImages} />
      )}

      {latestPosts.length > 0 && <BlogSection posts={latestPosts} />}

      <Team />

      <AuditionBand />

      <Footer />
    </main>
  )
}
