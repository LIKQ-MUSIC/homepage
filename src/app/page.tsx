import Navbar from '@/components/Navbar'
import Works from '@/components/Works'
import Team from '@/components/Team'
import Footer from '@/components/Footer'
import BlogSection from '@/components/BlogSection'
import Ignition from '@/components/home/Ignition'
import MakeStation from '@/components/home/MakeStation'
import AboutStation from '@/components/home/AboutStation'
import ArtistStation from '@/components/home/ArtistStation'
import ShopStation from '@/components/home/ShopStation'
import HomeClose from '@/components/home/HomeClose'
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
      image:
        item.image_url ||
        (item.youtube_id
          ? `https://i.ytimg.com/vi/${item.youtube_id}/hqdefault.jpg`
          : ''),
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
  const [worksData, latestPosts] = await Promise.all([
    getWorks(),
    getLatestBlogs()
  ])

  return (
    <div className="likq font-seed min-h-screen overflow-x-hidden">
      <Navbar tone="dark" />
      <main>
        <div className="beam-source">
          <Ignition hasWorks={worksData.length > 0} />
        </div>

        {/* Client lane. Dark field, white text. */}
        <div className="beam-lane-make">
          {worksData.length > 0 && <Works items={worksData} />}
          <MakeStation />
          <AboutStation />
        </div>

        {/* The beam opens out. Deliberately empty: this is the only stretch of
          field that crosses the band where neither white nor ink holds AA. */}
        <div className="beam-turn" aria-hidden />

        {/* Label lane. Pale field, ink text. */}
        <div className="beam-lane-label">
          <ArtistStation />
          <ShopStation />
          {latestPosts.length > 0 && <BlogSection posts={latestPosts} />}
        </div>

        {/* The light lands. */}
        <div className="beam-landing">
          <Team />
          <HomeClose />
        </div>
      </main>
      <Footer />
    </div>
  )
}
