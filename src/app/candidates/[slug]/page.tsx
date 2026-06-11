import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Sparkles, Quote } from 'lucide-react'
import {
  CANDIDATES,
  THEME_STYLES,
  getCandidateBySlug,
} from '@/data/candidates'
import { CandidatePortrait } from '../_components/CandidatePortrait'
import { CandidatePhotoCarousel } from '../_components/CandidatePhotoCarousel'
import { SocialLinks } from '../_components/SocialLinks'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  if (process.env.VERCEL_ENV === 'production') return []
  return CANDIDATES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const candidate = getCandidateBySlug(slug)
  if (!candidate) return { title: 'Candidate not found' }
  return {
    title: `${candidate.nickname} | LIKE YOU CANDIDATE`,
    description: candidate.tagline,
  }
}

export default async function CandidateProfilePage({ params }: Props) {
  // Not exposed on production yet: the homepage trainee section is enough there.
  if (process.env.VERCEL_ENV === 'production') notFound()

  const { slug } = await params
  const candidate = getCandidateBySlug(slug)
  if (!candidate) notFound()

  const t = THEME_STYLES[candidate.theme]

  return (
    <div className="theme-y2k min-h-screen bg-y2k-cobalt text-white y2k-scanlines">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-y2k-cobalt/95 backdrop-blur border-b-[3px] border-y2k-ink">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/candidates"
            className="-mx-2 -my-1 inline-flex items-center gap-2 px-2 py-2 font-pixel text-[10px] tracking-wider uppercase text-y2k-mint transition-colors hover:text-y2k-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFE14C]"
          >
            <ArrowLeft size={14} strokeWidth={3} />
            Back to Select
          </Link>
          <span className="font-pixel-mono text-[14px] text-white/70 tracking-wider">
            {candidate.referenceNumber}
          </span>
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <header className="relative">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              candidate.theme === 'pink'
                ? 'radial-gradient(circle at 20% 30%, #FF3AA5 0%, transparent 40%)'
                : candidate.theme === 'mint'
                  ? 'radial-gradient(circle at 80% 30%, #2DE8C3 0%, transparent 40%)'
                  : 'radial-gradient(circle at 50% 30%, #FFE14C 0%, transparent 40%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 pt-8 pb-10 md:pt-14 md:pb-16 grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 md:gap-10 items-start">
          {/* Portrait */}
          <div
            className="border-[4px] border-y2k-ink bg-y2k-cream"
            style={{ boxShadow: t.shadow }}
          >
            {candidate.images && candidate.images.length > 1 ? (
              <CandidatePhotoCarousel
                images={candidate.images}
                nickname={candidate.nickname}
                className="aspect-[4/5] w-full"
                priority
              />
            ) : (
              <CandidatePortrait
                candidate={candidate}
                className="aspect-[4/5] w-full"
                priority
                alt={`Portrait ของ ${candidate.nickname}`}
              />
            )}
          </div>

          {/* Header text */}
          <div>
            <div className={`inline-flex items-center gap-1.5 mb-5 y2k-badge ${t.badgeBg} !text-y2k-ink`}>
              <Sparkles size={11} />
              CANDIDATE PROFILE
            </div>

            <div className="font-pixel text-[10px] tracking-[0.3em] uppercase text-white/60 mb-2">
              {candidate.fullName}
            </div>
            <h1 className="font-pixel text-[clamp(40px,9vw,80px)] leading-[0.95] mb-4">
              <span className={t.accentText}>{candidate.nickname}</span>
            </h1>
            <p className="font-pixel-mono text-[20px] md:text-[24px] text-white/90 leading-tight mb-5">
              {candidate.tagline}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {candidate.traits.map((trait) => (
                <span
                  key={trait}
                  className={`y2k-badge ${t.badgeBg} !text-y2k-ink`}
                >
                  {trait}
                </span>
              ))}
            </div>

            {/* Curator note */}
            <div
              className="bg-y2k-cream text-y2k-ink border-[3px] border-y2k-ink p-4 md:p-5"
              style={{ boxShadow: '4px 4px 0 0 #0D0A2C' }}
            >
              <div className="font-pixel text-[9px] tracking-[0.3em] uppercase text-y2k-ink/60 mb-2">
                ทำไมเราเลือก
              </div>
              <p className="font-prompt text-base md:text-lg leading-relaxed">
                {candidate.curatorNote}
              </p>
            </div>

            <SocialLinks socials={candidate.socials} nickname={candidate.nickname} />
          </div>
        </div>
      </header>

      {/* ═══ DANCE VIDEO ═══ */}
      <section className="relative max-w-3xl mx-auto px-4 pt-2 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`y2k-badge ${t.badgeBg} !text-y2k-ink`}>Dance Video</span>
          <span aria-hidden className="flex-1 border-t-[2px] border-dashed border-white/30" />
        </div>
        {candidate.danceVideos && candidate.danceVideos.length > 0 ? (
          <div className="flex flex-col items-center gap-6">
            {candidate.danceVideos.map((src, i) => (
              <DanceVideoFrame
                key={src}
                src={src}
                shadow={t.shadow}
                nickname={candidate.nickname}
                index={i + 1}
                total={candidate.danceVideos!.length}
              />
            ))}
          </div>
        ) : (
          <div
            className="relative mx-auto w-full max-w-[360px] bg-y2k-ink border-[4px] border-y2k-ink overflow-hidden"
            style={{ boxShadow: t.shadow }}
          >
            <div className="aspect-[9/16] flex flex-col items-center justify-center gap-3">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 1px, transparent 1px 6px)',
                }}
              />
              <span className={`font-pixel text-[clamp(14px,4vw,22px)] tracking-widest uppercase ${t.accentText}`}>
                Dance Video
              </span>
              <span className="font-pixel text-[10px] tracking-[0.3em] uppercase text-white/50">
                Coming soon
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ═══ Q&A SECTIONS ═══ */}
      <section className="relative max-w-3xl mx-auto px-4 pb-20 space-y-6">
        <QABlock
          theme={candidate.theme}
          label="Idol Meaning"
          question="การเป็นไอดอลคืออะไร"
          answer={candidate.idolMeaning}
        />
        <QABlock
          theme={candidate.theme}
          label="Creative Project"
          question="โปรเจกต์ที่ภูมิใจที่สุด"
          answer={candidate.creativeProject}
        />
        <QABlock
          theme={candidate.theme}
          label="One Year Vision"
          question="ภาพตัวเองในอีก 1 ปี"
          answer={candidate.oneYearVision}
        />
        <QABlock
          theme={candidate.theme}
          label="Demo Analysis"
          question="วิเคราะห์เดโม่ที่ค่ายให้ฟัง"
          answer={candidate.demoAnalysis}
        />

        {/* Highlight pressure answer */}
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 mb-3 y2k-badge bg-y2k-ink !text-y2k-yellow">
            <Quote size={11} />
            STAGE 04 / PRESSURE TEST
          </div>
          <div
            className="bg-y2k-ink border-[4px] border-y2k-yellow p-5 md:p-7"
            style={{ boxShadow: `6px 6px 0 0 ${themeHex(candidate.theme)}` }}
          >
            <div className="font-pixel text-[10px] tracking-[0.3em] uppercase text-y2k-yellow/80 mb-2">
              คำถาม
            </div>
            <p className="font-prompt text-lg md:text-xl text-white mb-5 leading-snug">
              {candidate.highlight.question}
            </p>
            <div className={`font-pixel text-[10px] tracking-[0.3em] uppercase mb-2 ${t.accentText}`}>
              คำตอบของ {candidate.nickname}
            </div>
            <blockquote className="font-prompt text-base md:text-lg text-white/95 leading-relaxed border-l-[3px] border-y2k-yellow pl-4">
              {candidate.highlight.answer}
            </blockquote>
          </div>
        </div>

        {/* Footer nav */}
        <div className="pt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Link
            href="/candidates"
            className="inline-flex items-center justify-center gap-2 y2k-btn bg-y2k-cream text-y2k-ink hover:bg-y2k-mint"
          >
            <ArrowLeft size={14} strokeWidth={3} />
            เลือกคนอื่นดู
          </Link>
          <Link href="/audition" className="inline-flex items-center justify-center gap-2 y2k-btn-primary">
            <Sparkles size={14} />
            สมัครออดิชั่นรอบนี้
          </Link>
        </div>
      </section>
    </div>
  )
}

function toEmbedUrl(url: string): string {
  // Google Drive single-file share link -> embeddable preview
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  // YouTube watch / short links -> embed
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`
  const shortMatch = url.match(/youtu\.be\/([^?]+)/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
  return url
}

function DanceVideoFrame({
  src,
  shadow,
  nickname,
  index,
  total,
}: {
  src: string
  shadow: string
  nickname: string
  index: number
  total: number
}) {
  // Local /public files play in a <video>; remote share links are embedded.
  const isFile = src.startsWith('/') || /\.(mp4|webm|mov)(\?|$)/i.test(src)
  const label = total > 1 ? ` (คลิป ${index})` : ''

  const tag = total > 1 && (
    <span className="absolute left-2 top-2 z-10 inline-flex h-7 min-w-7 items-center justify-center border-[2px] border-y2k-yellow bg-y2k-ink px-1.5 font-pixel text-[11px] text-y2k-yellow">
      {String(index).padStart(2, '0')}
    </span>
  )

  if (isFile) {
    // Keep the clip's own aspect ratio. Bounding by both height and width sizes
    // portrait and landscape footage sensibly; the frame shrinks to fit.
    return (
      <div
        className="relative inline-block w-fit max-w-full overflow-hidden border-[4px] border-y2k-ink bg-y2k-ink"
        style={{ boxShadow: shadow }}
      >
        {tag}
        <video
          src={src}
          controls
          playsInline
          preload="metadata"
          aria-label={`Dance video ของ ${nickname}${label}`}
          className="block h-auto w-auto max-h-[560px] max-w-full md:max-w-[480px]"
        />
      </div>
    )
  }

  // Embeds need a fixed box; assume a portrait clip.
  return (
    <div
      className="relative w-full max-w-[340px] overflow-hidden border-[4px] border-y2k-ink bg-y2k-ink"
      style={{ boxShadow: shadow }}
    >
      {tag}
      <div className="aspect-[9/16]">
        <iframe
          src={toEmbedUrl(src)}
          title={`Dance video ของ ${nickname}${label}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  )
}

function themeHex(theme: 'pink' | 'mint' | 'yellow'): string {
  return theme === 'pink' ? '#FF3AA5' : theme === 'mint' ? '#2DE8C3' : '#FFE14C'
}

function QABlock({
  theme,
  label,
  question,
  answer,
}: {
  theme: 'pink' | 'mint' | 'yellow'
  label: string
  question: string
  answer: string
}) {
  const t = THEME_STYLES[theme]
  return (
    <article className="relative">
      <div className="flex items-center gap-2 mb-3">
        <span className={`y2k-badge ${t.badgeBg} !text-y2k-ink`}>{label}</span>
        <span aria-hidden className="flex-1 border-t-[2px] border-dashed border-white/30" />
      </div>
      <div
        className="bg-y2k-cream text-y2k-ink border-[3px] border-y2k-ink p-5 md:p-6"
        style={{ boxShadow: '4px 4px 0 0 #0D0A2C' }}
      >
        <h3 className="font-pixel text-[14px] md:text-[16px] tracking-wider text-y2k-ink mb-3 leading-tight">
          {question}
        </h3>
        <p className="font-prompt text-base md:text-lg leading-relaxed text-y2k-ink/90">
          {answer}
        </p>
      </div>
    </article>
  )
}
