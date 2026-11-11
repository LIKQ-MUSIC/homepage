import React from 'react'
import Image from 'next/image'

/**
 * The show on sale, set ahead of the wordmark so it is the first thing the
 * homepage says. One panel, all of it clickable, straight to the ticket page.
 *
 * Red rather than the beam's blue on purpose: it is the poster's own colour and
 * the only warm surface on the page, so it reads as news, not as a section.
 *
 * It manages its own lifetime. The Early Bird line drops after 7 Dec and the
 * whole panel after the show; the page rebuilds hourly (revalidate 3600), so
 * each switch lands within the hour without anyone shipping a change.
 *
 * A plain <a>: /merch is the store app behind a rewrite, and <Link> would try an
 * RSC fetch across that boundary. Self-contained (no shared marks or theme
 * tokens) so the same file renders on both homepage layouts.
 */
const EVENT = {
  href: '/merch/th/event/likq-christmas-party-2026',
  poster:
    'https://cdn.likqmusic.com/store/products/1794383165000-likq-christmas-party-2026.jpg',
  earlyBirdUntil: Date.parse('2026-12-07T23:59:59+07:00'),
  endsAt: Date.parse('2026-12-13T21:00:00+07:00')
}

const LINEUP = [
  'FLEURIZ',
  'WISSY',
  '2nd Dimension',
  'FleurVive',
  '101KG',
  'NekoWink',
  'NYKW',
  'KIMYORA'
]

const EventBanner = ({ now = Date.now() }: { now?: number }) => {
  if (now > EVENT.endsAt) return null
  const earlyBird = now <= EVENT.earlyBirdUntil

  return (
    <section
      aria-label="LiKQ MUSIC's Christmas Party 2026"
      className="relative px-4 pt-24 md:px-12 md:pt-28"
    >
      <a
        href={EVENT.href}
        className="group relative mx-auto grid max-w-6xl grid-cols-[38%_1fr] items-center gap-4 overflow-hidden rounded-[2rem] bg-[#9e1b1b] p-4 text-white shadow-[0_24px_60px_-20px_rgba(20,0,60,0.6)] transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:grid-cols-[20rem_1fr] md:gap-10 md:p-8"
      >
        {/* A warm bloom behind the copy, so the panel is lit like the poster. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_85%_15%,rgba(255,196,120,0.28),transparent_70%)]"
        />

        <Image
          src={EVENT.poster}
          alt="โปสเตอร์งาน LiKQ MUSIC's Christmas Party 2026"
          width={1500}
          height={1875}
          priority
          sizes="(min-width: 768px) 20rem, 38vw"
          className="relative aspect-[4/5] w-full rounded-[1.25rem] object-cover shadow-[0_12px_30px_-10px_rgba(0,0,0,0.55)]"
        />

        <div className="relative min-w-0">
          {earlyBird && (
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#9e1b1b] md:px-4 md:py-1.5 md:text-base">
              Early Bird ฿199
              <span className="font-normal text-[#9e1b1b]/80">ถึง 7 ธ.ค. นี้</span>
            </p>
          )}

          <h2 className="mt-3 text-[clamp(1.35rem,4.6vw,3.25rem)] font-bold leading-[1.1] md:mt-5">
            LiKQ MUSIC&apos;s Christmas Party 2026
          </h2>

          <p className="mt-2 text-sm text-white/90 md:mt-4 md:text-lg">
            อาทิตย์ 13 ธ.ค. 2569 ·{' '}
            <span className="whitespace-nowrap">13:00 - 21:00 น.</span>
          </p>
          <p className="text-sm text-white/90 md:text-lg">
            Volume Livehouse ชั้น B, The Street Ratchada
          </p>

          <p className="mt-4 hidden text-base text-white/85 md:block">
            {LINEUP.join(' · ')}
          </p>

          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#9e1b1b] transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none md:mt-7 md:px-8 md:py-4 md:text-lg">
            ซื้อบัตรเลย
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none md:h-5 md:w-5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </a>
    </section>
  )
}

export default EventBanner
