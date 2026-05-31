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
  name: string
  description: string
  url?: string
}[] = [
  {
    name: 'INSEKI PROJECT',
    description: 'เทรนนีสไตล์ JPOP อุกาบาตที่จะสร้างความแตกต่าง ภายใต้ LIKQ MUSIC'
  },
  {
    name: 'JOM KORR',
    description: 'ศัตรูคู่แข่งและคู่หูของ YORA ร็อคเกอร์แหวกขนบที่จะทำให้คุณแปลกใจ'
  },
  {
    name: 'KIMYORA',
    description: 'โซโล่หลากหลายผู้หลุดกรอบสร้างสรรค์'
  },
  {
    name: 'LIKE YOU PROJECT',
    description: 'เทรนนีเกิร์ลกรุ๊บมากความสามารถภายใต้ค่าย LIKQ MUSIC'
  },
  {
    name: 'NekoWink',
    description: 'ไอดอลสาวแมวดำ 8 คน สไตล์คาวาอี้ญี่ปุ่น จาก BLT WORLD ENTERTAINMENT',
    url: 'https://www.likqmusic.com/nekowink'
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

      {/* Dictionary index list */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <ol className="space-y-0">
          {artists.map((a, i) => {
            const letter = a.name[0].toUpperCase()
            const prevLetter = i > 0 ? artists[i - 1].name[0].toUpperCase() : null
            const showLetter = letter !== prevLetter

            return (
              <li key={a.name}>
                {showLetter && (
                  <div className="pt-8 pb-2 first:pt-0">
                    <span className="text-3xl font-black text-primary/15 font-mono select-none">
                      {letter}
                    </span>
                    <hr className="border-neutral-200 mt-1" />
                  </div>
                )}
                {a.url ? (
                  <Link
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-5 px-2 -mx-2 hover:bg-white rounded-xl transition-colors"
                  >
                    <div className="min-w-0">
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
                  <div className="flex items-center justify-between gap-4 py-5 px-2 -mx-2">
                    <div className="min-w-0">
                      <p className="font-bold text-lg text-neutral-900">{a.name}</p>
                      <p className="text-sm text-neutral-500 mt-0.5">{a.description}</p>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </section>

      <Footer />
    </main>
  )
}
