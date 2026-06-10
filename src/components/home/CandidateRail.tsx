import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CANDIDATES } from '@/data/candidates'
import SectionHead from './SectionHead'

/**
 * Horizontal photo rail of the label's trainee candidates, feeding the
 * /candidates page. Photography does the talking; one line of their own
 * tagline under each portrait.
 */
const CandidateRail = () => {
  const candidates = CANDIDATES.filter(c => (c.images?.length || c.image))

  if (candidates.length === 0) return null

  return (
    <section className="bg-ink-deep py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-12">
        <SectionHead th="ศิลปินฝึกหัด" en="Trainees" />
      </div>

      <div className="mt-10 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-14">
        <ul className="flex w-max snap-x snap-mandatory gap-4 px-5 md:gap-6 md:px-12">
          {candidates.map(c => {
            const src = c.images?.[0] ?? c.image!
            return (
              <li key={c.slug} className="snap-start">
                <Link
                  href={`/candidates/${c.slug}`}
                  className="group block w-[260px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary md:w-[300px]"
                  aria-label={`เปิดโปรไฟล์ของ ${c.nickname}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-ink-raise">
                    <Image
                      src={src}
                      alt={`ภาพถ่ายของ ${c.nickname}`}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                      sizes="300px"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 to-transparent p-4 pt-12">
                      <p className="font-prompt text-xl font-bold text-ink-text">
                        {c.nickname}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                    {c.tagline}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-5 md:px-12">
        <Link
          href="/candidates"
          className="font-archivo text-sm font-semibold uppercase tracking-[0.18em] text-secondary underline-offset-8 hover:underline"
        >
          ดูโปรไฟล์ทั้งหมด →
        </Link>
      </div>
    </section>
  )
}

export default CandidateRail
