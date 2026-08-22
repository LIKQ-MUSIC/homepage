import React from 'react'

/**
 * The brand world's drawn marks. One stroke weight (1.25 at 24px), round caps,
 * no fills except where a shape is genuinely solid. Authored here rather than
 * pulled from an icon set so the page never mixes two drawing hands, and never
 * substitutes a unicode glyph for an icon.
 */

type MarkProps = { className?: string; style?: React.CSSProperties }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
}

/** The deck's four-point light glint. Solid, because a spark has no outline. */
export const Glint = ({ className, style }: MarkProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    aria-hidden
  >
    <path d="M12 0c.6 6.3 5.1 10.8 12 12-6.9 1.2-11.4 5.7-12 12-.6-6.3-5.1-10.8-12-12C6.9 10.8 11.4 6.3 12 0Z" />
  </svg>
)

/** Writing and composing: a pen nib over a stave line. */
export const MarkPen = ({ className }: MarkProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M4 20h16" />
    <path d="M14.5 4.5 6 13l-1 6 6-1 8.5-8.5a2.5 2.5 0 0 0-3.5-3.5Z" />
  </svg>
)

/** Vocal edit and tune: a waveform being pulled into pitch. */
export const MarkVoice = ({ className }: MarkProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M3 12h2.5l2-6 3 12 2.5-9 2 5H21" />
  </svg>
)

/** Arrangement: parts stacked into one score. */
export const MarkArrange = ({ className }: MarkProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M4 6h16M4 12h11M4 18h7" />
    <circle cx="19.5" cy="12" r="1.6" />
    <circle cx="15.5" cy="18" r="1.6" />
  </svg>
)

/** Mix and master: faders on a board. */
export const MarkMix = ({ className }: MarkProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M6 3v6M6 15v6M12 3v10M12 19v2M18 3v2M18 11v10" />
    <circle cx="6" cy="12" r="2.2" />
    <circle cx="12" cy="16" r="2.2" />
    <circle cx="18" cy="8" r="2.2" />
  </svg>
)

/** Music for advertising: a signal leaving the building. */
export const MarkBroadcast = ({ className }: MarkProps) => (
  <svg {...base} className={className} aria-hidden>
    <circle cx="12" cy="12" r="2.2" />
    <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 16.2a6 6 0 0 0 0-8.4" />
    <path d="M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 19.4a10.5 10.5 0 0 0 0-14.8" />
  </svg>
)

/** Fansong and gifts: a wrapped record. */
export const MarkGift = ({ className }: MarkProps) => (
  <svg {...base} className={className} aria-hidden>
    <circle cx="12" cy="13" r="7.5" />
    <circle cx="12" cy="13" r="1.8" />
    <path d="M12 5.5V2M9 3.4 12 5.5l3-2.1" />
  </svg>
)

/** Merch: a shop bag. */
export const MarkBag = ({ className }: MarkProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M4.5 8h15l-1.2 11.2a2 2 0 0 1-2 1.8H7.7a2 2 0 0 1-2-1.8L4.5 8Z" />
    <path d="M8.75 8V6a3.25 3.25 0 0 1 6.5 0v2" />
  </svg>
)

/** The quiz: a question inside the Q. */
export const MarkQuiz = ({ className }: MarkProps) => (
  <svg {...base} className={className} aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9.6a2.5 2.5 0 1 1 3.2 2.4c-.5.2-.8.7-.8 1.2v.6" />
    <path d="M12 17.2h.01" />
  </svg>
)

/** Arrow used for paths and onward links. */
export const MarkArrow = ({ className }: MarkProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)

/** The scroll cue at the foot of the first viewport. */
export const MarkDescend = ({ className }: MarkProps) => (
  <svg {...base} className={className} aria-hidden>
    <path d="M12 3v18M6 15l6 6 6-6" />
  </svg>
)
