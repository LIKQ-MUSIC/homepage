import Section from '@/components/Section'
import Navbar from '@/components/Navbar'
import { Title } from '@/ui/Typography'
import Microphone from '@/ui/Icons/Microphone'
import Card from '@/components/Card'
import HeroCarousel from '@/components/HeroCarousel'
import Works from '@/components/Works'
import Team from '@/components/Team'
import Footer from '@/components/Footer'
import Fansong from '@/ui/Icons/Fansong'
import Advertised from '@/ui/Icons/Advertised'
import MixMaster from '@/ui/Icons/MixMaster'
import WritingComposing from '@/ui/Icons/WritingComposing'
import Arrange from '@/ui/Icons/Arrange'
import AboutUs from '@/components/AboutUs'
import BlogSection from '@/components/BlogSection'
import ColorStory from '@/components/ColorStory'
import DonationSection from '@/components/DonationSection'
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
  const [worksData, aboutUsData, latestPosts] = await Promise.all([
    getWorks(),
    getAboutUsImages(),
    getLatestBlogs()
  ])

  // Map to component format or use default if empty/failed
  const aboutUsImages =
    aboutUsData && aboutUsData.length > 0
      ? aboutUsData.map((img: any) => ({
          src: img.image_url,
          alt: img.alt_text || ''
        }))
      : []

  const services = [
    {
      title: 'Writing and Composing',
      description: 'แต่งเพลงและแต่งทำนอง',
      icon: <WritingComposing className="text-primary" />
    },
    {
      title: 'Edit & Tune Vocal',
      description: 'จูนและแก้ไขเสียงร้อง',
      icon: <Microphone className="text-primary" />
    },
    {
      title: 'Arrange music',
      description: 'เรียบเรียงดนตรี',
      icon: <Arrange className="text-primary" />
    },
    {
      title: 'Mix & Mastering',
      description: 'ผสมเสียงและมาสเตอร์',
      icon: <MixMaster className="text-primary" />
    },
    {
      title: 'Advertised',
      description: 'แต่งเพลง ผลิตเพลง ประกอบโฆษณา',
      icon: <Advertised className="text-primary" />
    },
    {
      title: 'Music & Gift',
      description: 'Fansong ของขวัญ เนื่องในโอกาสพิเศษ',
      icon: <Fansong className="text-primary" />
    }
  ]
  return (
    <main className="min-h-screen bg-[#f8f9fb] text-neutral-900 font-sans overflow-x-hidden">
      <Navbar />
      <HeroCarousel images={aboutUsImages} />

      <AboutUs />

      <Section id="services" label="Our Services" title="บริการของเรา">
        <Title className="text-center" level={5}>
          บริการผลิตดนตรีหลากหลายรูปแบบ พร้อมทีมงานมืออาชีพมากประสบการณ์
        </Title>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {services.map(service => (
            <Card key={service.title} {...service} />
          ))}
        </div>
      </Section>

      <Works items={worksData} />

      <ColorStory />

      <DonationSection />

      <BlogSection posts={latestPosts} />

      <Team />

      <Footer />
    </main>
  )
}
