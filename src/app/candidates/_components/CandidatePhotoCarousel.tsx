'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CandidatePhotoCarouselProps {
  images: string[]
  nickname: string
  /** Tailwind aspect / sizing from the parent frame. */
  className?: string
  priority?: boolean
}

/**
 * Y2K-styled portrait carousel for the profile page. Crossfades between a
 * candidate's photos with hard-edged arrow controls and dot indicators. Falls
 * back to a single static image when there is only one photo.
 */
export function CandidatePhotoCarousel({
  images,
  nickname,
  className = '',
  priority = false,
}: CandidatePhotoCarouselProps) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const go = (delta: number) => setIndex((p) => (p + delta + count) % count)

  return (
    <div className={`relative overflow-hidden bg-y2k-cream ${className}`}>
      {images.map((src, i) => (
        <div
          key={src}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Image
            src={src}
            alt={`${nickname} photo ${i + 1} of ${count}`}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
            priority={priority && i === 0}
          />
        </div>
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="รูปก่อนหน้า"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center border-[3px] border-y2k-ink bg-y2k-cream text-y2k-ink shadow-[3px_3px_0_0_#0D0A2C] transition-transform active:translate-x-[2px] active:translate-y-[2px] hover:bg-y2k-yellow focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFE14C]"
          >
            <ChevronLeft size={18} strokeWidth={3} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="รูปถัดไป"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center border-[3px] border-y2k-ink bg-y2k-cream text-y2k-ink shadow-[3px_3px_0_0_#0D0A2C] transition-transform active:translate-x-[2px] active:translate-y-[2px] hover:bg-y2k-yellow focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFE14C]"
          >
            <ChevronRight size={18} strokeWidth={3} />
          </button>

          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 py-3">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`ไปรูปที่ ${i + 1}`}
                aria-current={i === index}
                className="group/dot -my-1 px-0.5 py-2 focus-visible:outline-none"
              >
                <span
                  className={`block h-2 border-2 border-y2k-ink transition-all ${
                    i === index ? 'w-7 bg-y2k-ink' : 'w-2 bg-y2k-cream group-hover/dot:bg-y2k-yellow'
                  } group-focus-visible/dot:ring-2 group-focus-visible/dot:ring-[#FFE14C] group-focus-visible/dot:ring-offset-2 group-focus-visible/dot:ring-offset-y2k-cream`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
