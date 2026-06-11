import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SiInstagram, SiTiktok } from 'react-icons/si'
import { CANDIDATES } from '@/data/candidates'
import SectionHead from './SectionHead'

/**
 * The label's trainee candidates, shown inline on the dark home surface as a
 * compact gallery: portrait, tagline, traits, the pressure-test question, and
 * socials. Each trainee's Y2K theme colour appears only as a small accent so
 * the section stays in the premium navy palette. The full /candidates index
 * isn't on production yet, so the link to it only renders off production.
 */
const THEME_ACCENT: Record<string, string> = {
  pink: '#FF3AA5',
  mint: '#2DE8C3',
  yellow: '#FFE14C'
}

const CandidateRail = () => {
  const candidates = CANDIDATES.filter(c => c.images?.length || c.image)

  if (candidates.length === 0) return null

  const showAllLink = process.env.VERCEL_ENV !== 'production'

  return (
    <section className="bg-ink-deep py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-12">
        <SectionHead th="ศิลปินฝึกหัด" en="Trainees" />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
          ทำความรู้จักน้องๆ ที่กำลังฝึกกับเราก่อนใคร
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {candidates.map(c => {
            const accent = THEME_ACCENT[c.theme] ?? '#BEADC4'
            const src = c.images?.[0] ?? c.image!
            const hasSocials =
              c.socials && (c.socials.instagram || c.socials.tiktok)
            return (
              <article key={c.slug} className="group flex h-full flex-col">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-ink-raise">
                  <Image
                    src={src}
                    alt={`ภาพถ่ายของ ${c.nickname}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/90 to-transparent p-4 pt-12">
                    <div className="flex items-center gap-2">
                      <h3 className="font-prompt text-xl font-bold text-ink-text">
                        {c.nickname}
                      </h3>
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: accent }}
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                  {c.tagline}
                </p>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {c.traits.slice(0, 3).map(trait => (
                    <li
                      key={trait}
                      className="rounded-full border border-secondary/25 bg-secondary/10 px-2.5 py-0.5 text-[11px] font-medium text-secondary"
                    >
                      {trait}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 line-clamp-3 text-sm leading-snug text-ink-text/85">
                  <span
                    aria-hidden
                    className="mr-1 align-[-0.15em] text-lg leading-none"
                    style={{ color: accent }}
                  >
                    “
                  </span>
                  {c.highlight.question}
                </p>

                {hasSocials && (
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    {c.socials!.instagram && (
                      <a
                        href={c.socials!.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Instagram ของ ${c.nickname}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-line bg-white/[0.03] text-ink-muted transition-colors hover:border-secondary hover:text-secondary"
                      >
                        <SiInstagram className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {c.socials!.tiktok && (
                      <a
                        href={c.socials!.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`TikTok ของ ${c.nickname}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-line bg-white/[0.03] text-ink-muted transition-colors hover:border-secondary hover:text-secondary"
                      >
                        <SiTiktok className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {showAllLink && (
          <div className="mt-12">
            <Link
              href="/candidates"
              className="font-archivo text-sm font-semibold uppercase tracking-[0.18em] text-secondary underline-offset-8 hover:underline"
            >
              ดูโปรไฟล์ทั้งหมด →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default CandidateRail
