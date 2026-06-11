import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SiInstagram, SiTiktok } from 'react-icons/si'
import { CANDIDATES } from '@/data/candidates'
import SectionHead from './SectionHead'

/**
 * The label's trainee candidates, shown as full inline profiles on the dark
 * home surface: portrait, traits, the curator's note, and one pressure-test
 * answer each, so visitors read who they are without clicking through to the
 * /candidates profile. Alternating rows keep the photography leading. The
 * per-trainee theme colour (their Y2K profile identity) appears only as a
 * small accent so the section stays in the premium navy palette.
 */
const THEME_ACCENT: Record<string, string> = {
  pink: '#FF3AA5',
  mint: '#2DE8C3',
  yellow: '#FFE14C'
}

const CandidateRail = () => {
  const candidates = CANDIDATES.filter(c => c.images?.length || c.image)

  if (candidates.length === 0) return null

  return (
    <section className="bg-ink-deep py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-12">
        <SectionHead th="ศิลปินฝึกหัด" en="Trainees" />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
          ทำความรู้จักน้องๆ ที่กำลังฝึกกับเราก่อนใคร
        </p>

        <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
          {candidates.map((c, i) => {
            const accent = THEME_ACCENT[c.theme] ?? '#BEADC4'
            const src = c.images?.[0] ?? c.image!
            const flip = i % 2 === 1
            const hasSocials = c.socials && (c.socials.instagram || c.socials.tiktok)
            return (
              <article
                key={c.slug}
                className="group grid items-center gap-7 md:grid-cols-2 md:gap-12"
              >
                {/* Portrait: photography leads */}
                <div
                  className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-raise ${
                    flip ? 'md:order-2' : ''
                  }`}
                >
                  <Image
                    src={src}
                    alt={`ภาพถ่ายของ ${c.nickname}`}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Profile: key highlights inline */}
                <div className={flip ? 'md:order-1' : ''}>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-prompt text-3xl font-bold text-ink-text md:text-4xl">
                      {c.nickname}
                    </h3>
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                  </div>
                  <span
                    aria-hidden
                    className="mt-3 block h-[3px] w-10 rounded-full"
                    style={{ backgroundColor: accent }}
                  />

                  <p className="mt-4 text-base leading-relaxed text-ink-muted">
                    {c.tagline}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {c.traits.map(trait => (
                      <li
                        key={trait}
                        className="rounded-full border border-secondary/25 bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary"
                      >
                        {trait}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <p className="text-xs font-semibold tracking-wide text-secondary">
                      ทำไมเราถึงเลือก
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-text/90">
                      {c.curatorNote}
                    </p>
                  </div>

                  <figure className="mt-6 rounded-2xl border border-ink-line bg-white/[0.03] p-5">
                    <figcaption className="text-xs text-ink-muted">
                      {c.highlight.question}
                    </figcaption>
                    <blockquote className="mt-2 font-prompt text-lg leading-snug text-ink-text">
                      <span
                        aria-hidden
                        className="mr-1 align-[-0.15em] text-2xl leading-none"
                        style={{ color: accent }}
                      >
                        “
                      </span>
                      {c.highlight.answer}
                    </blockquote>
                  </figure>

                  {hasSocials && (
                    <div className="mt-6 flex items-center gap-3">
                      {c.socials!.instagram && (
                        <a
                          href={c.socials!.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Instagram ของ ${c.nickname}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-line bg-white/[0.03] text-ink-muted transition-colors hover:border-secondary hover:text-secondary"
                        >
                          <SiInstagram className="h-4 w-4" />
                        </a>
                      )}
                      {c.socials!.tiktok && (
                        <a
                          href={c.socials!.tiktok}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`TikTok ของ ${c.nickname}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-line bg-white/[0.03] text-ink-muted transition-colors hover:border-secondary hover:text-secondary"
                        >
                          <SiTiktok className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-16 md:mt-20">
          <Link
            href="/candidates"
            className="font-archivo text-sm font-semibold uppercase tracking-[0.18em] text-secondary underline-offset-8 hover:underline"
          >
            ดูโปรไฟล์ทั้งหมด →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CandidateRail
