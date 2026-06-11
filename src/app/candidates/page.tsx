import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { CANDIDATES, THEME_STYLES } from '@/data/candidates'
import { CandidatePortrait } from './_components/CandidatePortrait'

export const metadata: Metadata = {
  title: 'LIKE YOU CANDIDATE | LIKQ MUSIC',
  description:
    'เลือกตัวละครของคุณ. Idol-Artist Candidate ของ LIKQ MUSIC. คัดมาจากผู้ออดิชั่นที่ทัศนคติบวกและโดดเด่น',
}

export default function CandidatesLandingPage() {
  return (
    <div className="theme-y2k min-h-screen bg-y2k-cobalt text-white y2k-scanlines">
      {/* ═══ HERO ═══ */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 12% 18%, #FF3AA5 0%, transparent 28%), radial-gradient(circle at 88% 82%, #2DE8C3 0%, transparent 30%), radial-gradient(circle at 50% 50%, #FFE14C 0%, transparent 18%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 pt-14 pb-10 md:pt-20 md:pb-16">
          <div className="inline-flex items-center gap-1.5 mb-6 y2k-badge bg-y2k-yellow !text-y2k-ink">
            <Sparkles size={11} />
            SELECT YOUR CANDIDATE
          </div>

          <h1 className="font-pixel text-[clamp(34px,8vw,72px)] leading-[1.05] text-y2k-mint mb-3">
            LIKE YOU
            <br />
            <span className="text-y2k-yellow">CANDIDATE</span>
          </h1>
          <p className="font-pixel-mono text-[20px] md:text-[26px] text-white/90 leading-tight mb-5 max-w-2xl">
            {CANDIDATES.length} candidates. 1 รุ่นที่กำลังจะเริ่ม. เลือกใครก่อนก็ได้ แล้วเดี๋ยวพวกเขาเล่าให้ฟังเอง
          </p>
          <p className="font-prompt text-white/75 text-base md:text-lg max-w-xl leading-relaxed">
            ทั้งสามคนนี้ผ่านคำถามชุดเดียวกันกับทุกคนที่สมัครออดิชั่น
            แล้วทีม A&amp;R เลือกมาด้วยทัศนคติ ไม่ใช่ผลงาน
          </p>

          <div className="mt-7 flex items-center gap-2 font-pixel text-[10px] tracking-wider text-y2k-pink-soft">
            <span className="w-2 h-2 bg-y2k-pink animate-y2k-blink" />
            TAP TO ENTER PROFILE
          </div>
        </div>
      </header>

      {/* ═══ CHARACTER GRID ═══ */}
      <section className="relative max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {CANDIDATES.map((candidate, idx) => {
            const t = THEME_STYLES[candidate.theme]
            return (
              <Link
                key={candidate.slug}
                href={`/candidates/${candidate.slug}`}
                className="group relative block h-full focus:outline-none"
                aria-label={`เปิดโปรไฟล์ของ ${candidate.nickname}`}
              >
                {/* Card frame */}
                <div
                  className="relative flex h-full flex-col bg-y2k-cream border-[4px] border-y2k-ink transition-transform duration-200 ease-out group-hover:-translate-y-1 group-active:translate-y-0 group-focus-visible:-translate-y-1"
                  style={{ boxShadow: t.shadow }}
                >
                  {/* Number tag */}
                  <div className="absolute -top-3 -left-3 z-10 inline-flex items-center justify-center w-10 h-10 bg-y2k-ink text-y2k-yellow font-pixel text-[14px] border-[3px] border-y2k-yellow">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  {/* Portrait */}
                  <CandidatePortrait
                    candidate={candidate}
                    className="aspect-[4/5] w-full shrink-0 border-b-[4px] border-y2k-ink"
                    priority={idx === 0}
                  />

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-4 md:p-5">
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {candidate.traits.map((trait) => (
                        <span
                          key={trait}
                          className={`y2k-badge ${t.badgeBg} !text-y2k-ink`}
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    <div className="font-pixel text-[10px] tracking-[0.3em] uppercase text-y2k-ink/60 mb-1">
                      Candidate
                    </div>
                    <h2 className="font-pixel text-[28px] md:text-[32px] leading-none text-y2k-ink mb-3">
                      {candidate.nickname}
                    </h2>
                    <p className="font-prompt text-sm text-y2k-ink/80 leading-relaxed flex-1">
                      {candidate.tagline}
                    </p>

                    <div className="mt-4 pt-3 border-t-[2px] border-dashed border-y2k-ink/30 flex items-center justify-between">
                      <span className="font-pixel-mono text-[14px] text-y2k-ink/60 tracking-wider">
                        {candidate.referenceNumber}
                      </span>
                      <span className="inline-flex items-center gap-1 font-pixel text-[10px] tracking-wider text-y2k-ink group-hover:gap-2 group-focus-visible:gap-2 transition-all">
                        SELECT
                        <ArrowRight size={14} strokeWidth={3} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Focus ring */}
                <span className="pointer-events-none absolute inset-0 ring-0 group-focus-visible:ring-[3px] group-focus-visible:ring-y2k-yellow group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-y2k-cobalt" />
              </Link>
            )
          })}
        </div>

        {/* Marquee footer */}
        <div className="mt-14 overflow-hidden border-y-[3px] border-y2k-ink bg-y2k-cream text-y2k-ink py-2.5">
          <div className="flex whitespace-nowrap animate-y2k-marquee font-pixel text-[12px] tracking-[0.3em] uppercase">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="inline-flex shrink-0">
                {Array.from({ length: 8 }).map((__, j) => (
                  <span key={j} className="px-6">
                    ★ LIKE YOU CANDIDATE ★ LIKQ MUSIC ★ AUDITION ROUND ZERO ★
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/audition"
            className="inline-flex items-center gap-2 y2k-btn-primary"
          >
            <Sparkles size={14} />
            สมัครออดิชั่นรอบนี้
          </Link>
          <p className="mt-3 font-prompt text-sm text-white/70">
            อยากให้คนถัดไปเป็นคุณ?
          </p>
        </div>
      </section>
    </div>
  )
}
