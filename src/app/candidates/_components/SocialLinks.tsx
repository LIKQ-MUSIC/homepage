import { SiInstagram, SiTiktok } from 'react-icons/si'

const buttonClass =
  'inline-flex items-center gap-2 border-[3px] border-y2k-ink bg-y2k-cream text-y2k-ink px-3.5 py-2.5 font-pixel text-[10px] uppercase tracking-wider shadow-[3px_3px_0_0_#0D0A2C] transition-transform hover:bg-y2k-yellow active:translate-x-[2px] active:translate-y-[2px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFE14C]'

interface SocialLinksProps {
  socials?: {
    instagram?: string
    tiktok?: string
  }
  nickname: string
}

/** Y2K follow buttons for a candidate's public social profiles. */
export function SocialLinks({ socials, nickname }: SocialLinksProps) {
  if (!socials || (!socials.instagram && !socials.tiktok)) return null

  return (
    <div className="mt-6">
      <div className="font-pixel text-[9px] tracking-[0.3em] uppercase text-white/70 mb-2">
        Follow
      </div>
      <div className="flex flex-wrap gap-2.5">
        {socials.instagram && (
          <a
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
            aria-label={`Instagram ของ ${nickname}`}
          >
            <SiInstagram className="h-3.5 w-3.5" />
            Instagram
          </a>
        )}
        {socials.tiktok && (
          <a
            href={socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
            aria-label={`TikTok ของ ${nickname}`}
          >
            <SiTiktok className="h-3.5 w-3.5" />
            TikTok
          </a>
        )}
      </div>
    </div>
  )
}
