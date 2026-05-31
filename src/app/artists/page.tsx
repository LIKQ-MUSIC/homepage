import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ศิลปินพาร์ทเนอร์ | LiKQ MUSIC',
  description: 'รายชื่อศิลปินและโปรเจกต์ที่เป็นพาร์ทเนอร์กับ LiKQ MUSIC',
  alternates: { canonical: '/artists' },
  openGraph: {
    title: 'ศิลปินพาร์ทเนอร์ | LiKQ MUSIC',
    description: 'รายชื่อศิลปินและโปรเจกต์ที่เป็นพาร์ทเนอร์กับ LiKQ MUSIC',
    url: 'https://www.likqmusic.com/artists',
    type: 'website'
  }
}

const artists: {
  index: string
  name: string
  description: string
  url?: string
}[] = [
  {
    index: 'A',
    name: 'NekoWink',
    description: 'วงไอดอลสาว 8 คน สไตล์คาวาอี้ญี่ปุ่น',
    url: 'https://www.likqmusic.com/nekowink'
  },
  {
    index: 'B',
    name: 'LIKE YOU PROJECT',
    description: 'โปรเจกต์ไอดอลหน้าใหม่ของ LiKQ MUSIC'
  },
  {
    index: 'C',
    name: 'INSEKI PROJECT',
    description: 'โปรเจกต์ศิลปินใต้สังกัด LiKQ MUSIC'
  },
  {
    index: 'D',
    name: 'KIMYORA',
    description: 'ศิลปินโซโล่ในสังกัด LiKQ MUSIC'
  }
]

export default function ArtistsPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fb] text-neutral-900 font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary text-white px-4 md:px-8 pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-secondary text-xs font-bold tracking-[0.25em] uppercase mb-3">
            Partner Artists
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            ศิลปินพาร์ทเนอร์
          </h1>
          <p className="mt-4 text-white/70 text-base md:text-lg max-w-xl">
            ศิลปินและโปรเจกต์ที่ร่วมงานกับ LiKQ MUSIC
          </p>
        </div>
      </section>

      {/* Index list */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <ol className="space-y-0 divide-y divide-neutral-200">
          {artists.map((a) => (
            <li key={a.index}>
              {a.url ? (
                <Link
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-6 py-6 hover:bg-white rounded-xl px-4 -mx-4 transition-colors"
                >
                  <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm font-mono">
                    {a.index}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg text-neutral-900 group-hover:text-primary transition-colors">
                      {a.name}
                    </p>
                    <p className="text-sm text-neutral-500 mt-0.5">{a.description}</p>
                  </div>
                  <ExternalLink
                    size={16}
                    className="flex-shrink-0 text-neutral-400 group-hover:text-primary transition-colors"
                  />
                </Link>
              ) : (
                <div className="flex items-center gap-6 py-6 px-4 -mx-4">
                  <span className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 font-bold text-sm font-mono">
                    {a.index}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg text-neutral-900">{a.name}</p>
                    <p className="text-sm text-neutral-500 mt-0.5">{a.description}</p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>

      <Footer />
    </main>
  )
}
