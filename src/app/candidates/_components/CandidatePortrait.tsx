import Image from 'next/image'
import type { Candidate, CandidateTheme } from '@/data/candidates'

const PLACEHOLDER_BG: Record<CandidateTheme, string> = {
  pink: 'bg-y2k-pink',
  mint: 'bg-y2k-mint',
  yellow: 'bg-y2k-yellow',
}

interface CandidatePortraitProps {
  candidate: Pick<Candidate, 'nickname' | 'image' | 'images' | 'theme'>
  /** Tailwind aspect or fixed-size container provided by parent */
  className?: string
  priority?: boolean
  alt?: string
}

/**
 * Renders the candidate photo when available, otherwise a Y2K-themed
 * placeholder block stamped with the nickname. Lets the team ship the
 * pages before final photography is delivered.
 */
export function CandidatePortrait({
  candidate,
  className = '',
  priority = false,
  alt,
}: CandidatePortraitProps) {
  const src = candidate.images?.[0] ?? candidate.image
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt ?? candidate.nickname}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={priority}
        />
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden ${PLACEHOLDER_BG[candidate.theme]} ${className}`}
      role="img"
      aria-label={`${candidate.nickname} placeholder portrait`}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 30%, #FFF6E6 0%, transparent 35%), radial-gradient(circle at 75% 70%, #0D0A2C 0%, transparent 30%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 mix-blend-multiply"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(13,10,44,0.6) 0 1px, transparent 1px 4px)',
        }}
      />
      <div className="relative h-full w-full flex flex-col items-center justify-center text-y2k-ink">
        <span className="font-pixel-mono text-[clamp(56px,12vw,160px)] leading-none drop-shadow-[3px_3px_0_#FFF6E6]">
          {candidate.nickname}
        </span>
        <span className="mt-2 font-pixel text-[9px] tracking-[0.3em] uppercase opacity-70">
          Photo coming soon
        </span>
      </div>
    </div>
  )
}
