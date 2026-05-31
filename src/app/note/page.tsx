import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ArrowRight, Music, Wallet, Tag, Users, LogIn, Clock, Sparkles } from 'lucide-react'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Note · แต้มสะสมของ LIKQ',
  description:
    'Note คือแต้มสะสมกลางของ LIKQ แต้มเดียวใช้ได้กับศิลปินทุกคนในค่าย ทุก 50 บาทได้ 1 Note ใช้ลดได้ 1 Note = 1 บาท',
  alternates: { canonical: '/note' },
  openGraph: {
    title: 'Note · แต้มสะสมของ LIKQ',
    description: 'แต้มเดียว ใช้ได้กับศิลปินทุกคนในค่าย LiKQ',
    url: 'https://www.likqmusic.com/note',
    type: 'website'
  }
}

const artists: { name: string; href: string | null; live: boolean }[] = [
  { name: 'NekoWink', href: '/nekowink', live: true },
  { name: 'KIMYORA', href: null, live: false },
  { name: 'LIKE YOU PROJECT', href: null, live: false },
  { name: 'INSEKI PROJECT', href: null, live: false }
]

const steps = [
  {
    icon: Wallet,
    title: 'จ่ายจริงครบ 50 บาท ได้ 1 Note',
    desc: 'พอชำระเงินสำเร็จ Note ก็เข้าบัญชีให้เองอัตโนมัติ ไม่ต้องกดสะสม ไม่ต้องสแกนอะไรเลย'
  },
  {
    icon: Tag,
    title: '1 Note = ส่วนลด 1 บาท',
    desc: 'ตอนจ่ายเงิน แค่ล็อกอินแล้วเลือกว่าจะใช้กี่ Note ระบบหักออกจากยอดให้ทันที จะใช้บางส่วนหรือใช้เต็มก็ได้'
  },
  {
    icon: Users,
    title: 'ใช้ข้ามศิลปินได้',
    desc: 'แต้มก้อนเดียวกัน เก็บจากศิลปินคนนึงวันนี้ พรุ่งนี้ไปใช้กับอีกคนในค่ายได้เลย ไม่ต้องเริ่มนับใหม่'
  }
]

const facts = [
  { icon: LogIn, text: 'แต้มผูกกับอีเมล ใช้ตอนไหนก็ต้องล็อกอินก่อน' },
  { icon: Clock, text: 'Note มีอายุ 6 เดือนนับจากวันที่ได้รับ ใช้ก่อนหมดอายุนะ' },
  { icon: Sparkles, text: 'ได้รับ Note เฉพาะยอดที่จ่ายจริงเท่านั้น' }
]

export default function NotePage() {
  return (
    <main className="min-h-screen bg-[#f8f9fb] text-neutral-900 font-sans overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-secondary/10 pointer-events-none" />
        <div className="absolute top-24 right-44 w-6 h-6 rounded-full bg-secondary pointer-events-none" />
        <div className="absolute bottom-32 right-32 w-4 h-4 rounded-full bg-secondary/70 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-36 md:pt-44 pb-20 md:pb-28">
          <div className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-secondary/30 text-secondary text-xs font-bold tracking-wider uppercase">
            <Music size={13} />
            LiKQ Rewards
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
            ♪ Note
            <br />
            แต้มเดียว ใช้ได้ทุกศิลปินในค่าย
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-secondary max-w-2xl">
            เป็นแฟนหลายศิลปิน แต้มก็มักจะแยกกันคนละร้าน ตรงนี้แหละที่ Note ต่างออกไป
            ช้อปของศิลปินคนไหนในค่าย ก็เก็บเข้ากระเป๋าใบเดียวกัน
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <p className="text-sm tracking-[0.3em] uppercase text-secondary-dark mb-3">How it works</p>
        <h2 className="text-2xl md:text-4xl font-bold text-primary leading-snug">
          สะสมง่าย ใช้ง่าย ไม่ต้องจำอะไรเยอะ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-7 shadow-sm ring-1 ring-black/5">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 text-primary flex items-center justify-center mb-5">
                <Icon size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-primary mb-2">{title}</h3>
              <p className="text-neutral-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Participating artists ── */}
      <section className="bg-white border-y border-black/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <p className="text-sm tracking-[0.3em] uppercase text-secondary-dark mb-3">เก็บ Note ได้จากใครบ้าง</p>
          <h2 className="text-2xl md:text-4xl font-bold text-primary leading-snug max-w-2xl">
            ศิลปินพาร์ทเนอร์ที่ใช้ Note ร่วมกัน
          </h2>
          <p className="mt-3 text-base md:text-lg text-neutral-500 max-w-2xl">
            ยิ่งค่ายโต Note ในมือคุณก็ยิ่งมีที่ใช้ และกำลังเพิ่มขึ้นเรื่อย ๆ
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
            {artists.map(({ name, href, live }) => {
              const inner = (
                <>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/20 text-primary flex items-center justify-center">
                      <Music size={24} />
                    </div>
                    <span className="text-xl font-bold text-primary truncate">{name}</span>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {live ? (
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-secondary-dark group-hover:gap-2 transition-all">
                        ช้อปเลย <ArrowRight size={16} />
                      </span>
                    ) : (
                      <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold text-neutral-400">
                        เร็ว ๆ นี้
                      </span>
                    )}
                  </div>
                </>
              )
              return live && href ? (
                <Link
                  key={name}
                  href={href}
                  className="group flex items-center justify-between rounded-2xl p-7 bg-[#f8f9fb] ring-1 ring-black/5 hover:ring-secondary/50 transition-colors"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  key={name}
                  className="flex items-center justify-between rounded-2xl p-7 bg-[#f8f9fb] ring-1 ring-black/5 opacity-75"
                >
                  {inner}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Good to know ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <p className="text-sm tracking-[0.3em] uppercase text-secondary-dark mb-3">จุดที่ควรรู้</p>
        <h2 className="text-2xl md:text-4xl font-bold text-primary leading-snug">ก่อนใช้ Note อ่านนิดนึง</h2>

        <div className="space-y-4 mt-8 max-w-2xl">
          {facts.map(({ icon: Icon, text }) => (
            <div key={text} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/20 text-primary flex items-center justify-center">
                <Icon size={20} />
              </div>
              <p className="text-base md:text-lg text-neutral-600 leading-relaxed pt-1.5">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 md:px-8 pb-16 md:pb-24 pt-4">
        <div className="relative max-w-5xl mx-auto rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary via-primary to-[#0c1d34] text-white px-6 sm:px-10 md:px-16 py-16 md:py-20 text-center shadow-xl shadow-primary/20">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-secondary/10 pointer-events-none" />
          <div className="absolute -bottom-20 -left-16 w-80 h-80 rounded-full bg-secondary/[0.07] pointer-events-none" />
          <div className="absolute top-12 left-12 w-2.5 h-2.5 rounded-full bg-secondary/70 pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-secondary/30 text-secondary text-xs font-bold tracking-wider uppercase">
              <Music size={13} />
              เริ่มเก็บเลย
            </div>
            <h2 className="text-2xl md:text-5xl font-bold leading-snug text-balance">
              <span className="inline-block">ล็อกอินแล้ว</span>{' '}
              <span className="inline-block">เริ่มเก็บ Note</span>{' '}
              <span className="inline-block">ได้ตั้งแต่ออเดอร์แรก</span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-secondary max-w-md mx-auto">
              ไว้ใช้กับศิลปินที่คุณรัก ทุกคนในค่าย LiKQ
            </p>
            <div className="mt-9 flex flex-wrap justify-center items-center gap-3">
              <Link
                href="/artists"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-7 py-3.5 rounded-full hover:bg-neutral-100 transition-colors active:scale-95 shadow-lg"
              >
                ดูศิลปินพาร์ทเนอร์
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white ring-1 ring-white/40 hover:bg-white/10 transition-colors active:scale-95"
              >
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
