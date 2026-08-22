import React from 'react'
import { Glint, MarkDescend } from './marks'
import VinylDisc from './VinylDisc'

/**
 * The source of the beam.
 *
 * The wordmark's Q is not set in type — it is the counter of the Q, and a
 * record turns inside it. That is the page's one authored moment: the aperture
 * opens on load and the disc is already spinning under a fixed sheen.
 *
 * This used to hold an autoplaying clip from cdn.likqmusic.com. The record
 * replaces it, which also takes the last piece of client JavaScript out of the
 * first viewport — everything here is now server-rendered SVG and CSS, and
 * prefers-reduced-motion is handled in the stylesheet rather than by a
 * matchMedia listener in a client component.
 *
 * The lockup stays on one line at every width and scales with the viewport;
 * stacking it splits "Lik" off from its Q and the wordmark stops being one.
 */
const Ignition = () => {
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
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pb-28 pt-32 text-white md:px-12">
      <Glint className="absolute left-[12%] top-[24%] h-4 w-4 animate-glint text-white/70" />
      <Glint
        className="absolute right-[16%] top-[62%] h-6 w-6 animate-glint text-likq-lavender"
        // offset so the two sparks never pulse in lockstep
        style={{ animationDelay: '1.6s' }}
      />

      {/* The clamp lives on the h1 so the lens can size itself in em against
          the same display size the wordmark is set at. items-center is load
          bearing: without it the lens stretches to the line box and stops
          being a circle. */}
      <h1 className="flex flex-row items-center justify-center gap-1 text-[clamp(3rem,29vw,18rem)] md:gap-3">
        <span className="sr-only">LikQ Music, Igniting the Quality</span>
        <span aria-hidden className="display-lockup animate-ignite">
          Lik
        </span>
        <span aria-hidden>{lens}</span>
      </h1>

      <p className="display-lockup mt-10 text-center text-[clamp(1.1rem,3.2vw,1.9rem)] tracking-[0.2em] text-white/85">
        Igniting the Quality
      </p>
      <p className="copy-th mt-5 max-w-md text-center text-base text-white/85 md:text-lg">
        ดีไซน์ตัวตนผ่านเสียงเพลง บรรเลงทุกคำให้เป็นคุณ
      </p>
      {/* The slogan alone never says what LIKQ is. This line does, in the
          plainest terms available, and it names both audiences at once. */}
      <p className="copy-th mt-4 text-center text-sm text-white/85 md:text-base">
        ทีมผลิตดนตรีครบวงจร · ค่ายเพลง · ออดิชั่นไอดอล
      </p>

      <a
        href="#prism"
        className="absolute bottom-10 flex flex-col items-center gap-2 text-white/80 transition-colors hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <span className="copy-th text-xs tracking-wider">เลือกทางของคุณ</span>
        <MarkDescend className="h-5 w-5" />
      </a>
    </section>
  )
}

export default Ignition
