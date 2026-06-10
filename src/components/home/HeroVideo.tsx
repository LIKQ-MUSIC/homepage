'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Button from '@/ui/Button'

const VIDEO_URL = 'https://cdn.likqmusic.com/homepage/landing-opt.mp4'
const POSTER = '/images/about/event-atmosphere.jpg'

const MARQUEE_ITEMS = [
  'Writing & Composing',
  'Edit & Tune Vocal',
  'Arrange Music',
  'Mix & Mastering',
  'Advertised',
  'Music & Gift'
]

/**
 * Full-bleed video hero. The lockup sits bottom-left (asymmetric), the old
 * taglines are kept verbatim, and a service marquee runs along the bottom
 * edge as the label's ticker. Reduced-motion gets the poster photo and a
 * static service row instead.
 */
const HeroVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (reducedMotion) videoRef.current?.pause()
  }, [reducedMotion])

  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink-deep text-ink-text">
      {/* media layer */}
      <div className="absolute inset-0">
        {reducedMotion ? (
          <Image
            src={POSTER}
            alt="บรรยากาศงานแสดงของ LIKQ Music"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={VIDEO_URL}
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        )}
        {/* scrim: keep the photo alive at the top, ground the type at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-deep/55 via-ink-deep/15 to-ink-deep" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-deep/55 via-transparent to-transparent" />
      </div>

      {/* lockup */}
      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-24 md:px-12 md:pb-28">
        <p
          className="mb-3 font-archivo font-semibold uppercase tracking-[0.22em] text-secondary text-xs md:text-sm opacity-0 animate-rise-in motion-reduce:animate-none motion-reduce:opacity-100"
          style={{ animationDelay: '0.05s' }}
        >
          Music Production &amp; Entertainment
        </p>
        <h1
          className="max-w-5xl font-archivo font-extrabold leading-[0.98] tracking-[-0.02em] text-[clamp(2.8rem,8.5vw,7rem)] [text-wrap:balance] opacity-0 animate-rise-in motion-reduce:animate-none motion-reduce:opacity-100"
          style={{ animationDelay: '0.15s' }}
        >
          Crafting Your Vibe.
          <br />
          Defining Your <span className="text-secondary">Sound</span>
        </h1>
        <p
          className="mt-5 max-w-xl text-base md:text-xl text-ink-text/85 leading-relaxed opacity-0 animate-rise-in motion-reduce:animate-none motion-reduce:opacity-100"
          style={{ animationDelay: '0.3s' }}
        >
          ดีไซน์ตัวตนผ่านเสียงเพลง บรรเลงทุกคำให้เป็นคุณ
        </p>
        <div
          className="mt-8 w-fit opacity-0 animate-rise-in motion-reduce:animate-none motion-reduce:opacity-100"
          style={{ animationDelay: '0.45s' }}
        >
          <Button
            href="#contact"
            variant="onDark"
            className="h-auto rounded-full px-9 py-4 text-base font-semibold"
          >
            เริ่มโปรเจกต์กับเรา
          </Button>
        </div>
      </div>

      {/* service ticker on the bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-ink-line bg-ink-deep/70 backdrop-blur-sm">
        <div className="overflow-hidden py-3" aria-hidden>
          <div className="flex w-max animate-label-marquee gap-0 motion-reduce:animate-none motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center">
            {[0, 1].map(half => (
              <div key={half} className="flex shrink-0">
                {MARQUEE_ITEMS.map(item => (
                  <span
                    key={`${half}-${item}`}
                    className="flex items-center gap-6 pr-6 font-archivo text-xs md:text-sm font-medium uppercase tracking-[0.18em] text-ink-muted"
                  >
                    {item}
                    <span className="h-1 w-1 rounded-full bg-secondary" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroVideo
