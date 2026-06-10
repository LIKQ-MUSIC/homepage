import React from 'react'
import { cn } from '@/utils'

/**
 * Catalog-style section header for the dark home surface.
 * Asymmetric baseline row: oversized Thai display on the left, a small
 * Archivo catalog label sitting on the same baseline to the right, then a
 * lavender hairline. Replaces the old centered tracked-uppercase eyebrow.
 */
const SectionHead = ({
  th,
  en,
  id,
  className
}: {
  th: string
  en: string
  id?: string
  className?: string
}) => {
  return (
    <header id={id} className={cn(['scroll-mt-24', className])}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 className="font-prompt font-bold text-ink-text leading-[1.05] text-[clamp(2.25rem,6vw,4.5rem)] [text-wrap:balance]">
          {th}
        </h2>
        <span
          aria-hidden
          className="font-archivo font-semibold text-secondary text-sm md:text-base tracking-[0.18em] uppercase"
        >
          {en}
        </span>
      </div>
      <div className="mt-5 h-px w-full bg-ink-line" />
    </header>
  )
}

export default SectionHead
