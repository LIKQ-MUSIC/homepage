import React from 'react'
import { MarkArrow } from './marks'
import VinylDisc from './VinylDisc'

/** The Q record remains the signature; music and people are one click away. */
const Ignition = ({ hasWorks = true }: { hasWorks?: boolean }) => {
  const lens = (
    <span className="relative block aspect-square w-[0.86em] shrink-0">
      <span className="q-aperture absolute inset-0 block animate-aperture-open bg-likq-ink">
        <VinylDisc className="h-full w-full" />
      </span>
      {/* The Q's tail, drawn rather than set. It begins over the outer grooves
          and crosses the rim: any further in and it lies across the label, any
          further out and it reads as a magnifying-glass handle. */}
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="absolute inset-0 h-full w-full overflow-visible text-white"
      >
        <path
          d="M76 76 L100 100"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  )

  return (
    <section
      id="home-intro"
      className="relative px-5 pb-14 pt-36 text-white md:px-12 md:pb-20 md:pt-44"
    >
      <div className="station-inner grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div>
          <h1 className="flex items-center gap-1 text-[clamp(3rem,26vw,15rem)] lg:text-[clamp(8rem,18vw,15rem)]">
            <span className="sr-only">LikQ Music, Igniting the Quality</span>
            <span aria-hidden className="display-lockup animate-ignite">
              Lik
            </span>
            <span aria-hidden>{lens}</span>
          </h1>
          <p className="display-lockup mt-7 text-[clamp(1.25rem,3vw,1.75rem)] text-white/80">
            Igniting the Quality
          </p>
        </div>
        <div className="max-w-lg">
          <p className="display-mixed text-balance text-[clamp(1.8rem,3.8vw,3rem)] text-white">
            ดีไซน์ตัวตนผ่านเสียงเพลง บรรเลงทุกคำให้เป็นคุณ
          </p>
          <p className="copy-th mt-5 text-base text-white/85">
            ทีมผลิตดนตรีครบวงจร · ค่ายเพลง
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href={hasWorks ? '#work' : '#make'}
              className="copy-th inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold text-likq-ink transition-colors hover:bg-likq-lavender-pale focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {hasWorks ? 'ดูผลงานของเรา' : 'ดูบริการของเรา'}
              <MarkArrow className="h-4 w-4" />
            </a>
            <a
              href="#label"
              className="copy-th inline-flex min-h-12 items-center gap-2 text-sm text-white underline-offset-8 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              รู้จักศิลปินฝึกหัด
              <MarkArrow className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Ignition
