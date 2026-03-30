'use client'

import { useCallback, useMemo } from 'react'
import { SiFacebook, SiX, SiLine } from 'react-icons/si'

interface ShareButtonsProps {
  title: string
  slug?: string
}

const SHARE_WINDOW_FEATURES = 'width=600,height=400,scrollbars=yes,resizable=yes'

const platforms = [
  {
    name: 'Facebook',
    icon: SiFacebook,
    getShareUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    hoverClass:
      'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] dark:hover:bg-[#1877F2] dark:hover:border-[#1877F2]',
  },
  {
    name: 'X',
    icon: SiX,
    getShareUrl: (url: string, title: string) =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    hoverClass:
      'hover:bg-slate-900 hover:text-white hover:border-slate-900 dark:hover:bg-white dark:hover:text-slate-900 dark:hover:border-white',
  },
  {
    name: 'Line',
    icon: SiLine,
    getShareUrl: (url: string) =>
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
    hoverClass:
      'hover:bg-[#06C755] hover:text-white hover:border-[#06C755] dark:hover:bg-[#06C755] dark:hover:border-[#06C755]',
  },
] as const

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const articleUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return slug
      ? `${window.location.origin}/blogs/${slug}`
      : window.location.href
  }, [slug])

  const handleShare = useCallback(
    (getShareUrl: (url: string, title: string) => string) => {
      const url =
        slug
          ? `${window.location.origin}/blogs/${slug}`
          : window.location.href
      window.open(getShareUrl(url, title), '_blank', SHARE_WINDOW_FEATURES)
    },
    [title, slug]
  )

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Share this post
      </span>
      <div className="flex gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            onClick={() => handleShare(platform.getShareUrl)}
            aria-label={`Share on ${platform.name}`}
            className={`
              w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700
              bg-slate-50 dark:bg-slate-800
              text-slate-600 dark:text-slate-300
              flex items-center justify-center
              transition-all duration-200
              ${platform.hoverClass}
            `}
          >
            <platform.icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  )
}
