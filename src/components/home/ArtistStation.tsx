import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SiInstagram, SiTiktok } from 'react-icons/si'
import { CANDIDATES } from '@/data/candidates'
import { MarkArrow } from './marks'

/**
 * The label lane opens. From here down the field has turned pale, so the text
 * regime flips: ink and obsidian on light, never white.
 *
 * Each trainee is held in the lens — the Q's counter is how this brand shows a
 * person, straight out of the deck. Their Y2K theme colour survives as a single
 * ring of light around the portrait, nothing more.
 */

const THEME_ACCENT: Record<string, string> = {
  pink: '#FF3AA5',
  mint: '#2DE8C3',
  yellow: '#FFE14C'
}

const ArtistStation = () => {
  const candidates = CANDIDATES.filter(c => c.images?.length || c.image)
  if (candidates.length === 0) return null

  const showAllLink = process.env.VERCEL_ENV !== 'production'

  return (
    <section id="label" className="station">
      <div className="station-inner">
        <h2 className="station-title text-likq-ink">ศิลปินฝึกหัด</h2>
        <p className="station-lede mt-6 text-likq-obsidian">
          ทำความรู้จักน้องๆ ที่กำลังฝึกกับเราก่อนใคร
        </p>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {candidates.map(c => {
            const accent = THEME_ACCENT[c.theme] ?? '#C075E4'
            const src = c.images?.[0] ?? c.image!
            const hasSocials =
              c.socials && (c.socials.instagram || c.socials.tiktok)

            return (
              <article key={c.slug} className="group flex h-full flex-col">
                <div
                  className="q-aperture relative aspect-square w-full bg-white/60 transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                  style={{ boxShadow: `0 0 0 2px ${accent}` }}
                >
                  <Image
                    src={src}
                    alt={`ภาพถ่ายของ ${c.nickname}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                <h3 className="copy-th mt-6 text-xl font-bold text-likq-ink">
                  {c.nickname}
                </h3>
                <p className="copy-th mt-1 line-clamp-2 text-sm sm:min-h-[3.25rem] text-likq-obsidian/80">
                  {c.tagline}
                </p>

                <ul className="mt-2 flex flex-wrap content-start sm:min-h-[3.5rem] gap-1.5">
                  {c.traits.slice(0, 3).map(trait => (
                    <li
                      key={trait}
                      className="copy-th rounded-full bg-likq-ink/[0.09] px-2.5 py-0.5 text-[11px] text-likq-ink"
                    >
                      {trait}
                    </li>
                  ))}
                </ul>

                <p className="copy-th mt-4 line-clamp-3 text-sm leading-snug text-likq-obsidian">
                  {c.highlight.answer}
                </p>

                {hasSocials && (
                  <div className="mt-auto flex items-center gap-2 pt-5">
                    {c.socials!.instagram && (
                      <a
                        href={c.socials!.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Instagram ของ ${c.nickname}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-likq-ink/[0.09] text-likq-ink transition-colors hover:bg-likq-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-likq-ink"
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
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-likq-ink/[0.09] text-likq-ink transition-colors hover:bg-likq-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-likq-ink"
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
          <Link
            href="/candidates"
            className="copy-th mt-14 inline-flex items-center gap-3 text-base text-likq-ink underline-offset-8 hover:underline"
          >
            ดูโปรไฟล์ทั้งหมด
            <MarkArrow className="h-5 w-5" />
          </Link>
        )}
      </div>
    </section>
  )
}

export default ArtistStation
