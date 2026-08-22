import React, { ReactNode } from 'react'
import { Calendar, Video, Link } from 'lucide-react'
import { cn } from '@/utils'

interface ICategoriesBadgeProps {
  category: 'video' | 'event' | 'link'
  className?: string
}

const CategoriesBadge = ({ category, className }: ICategoriesBadgeProps) => {
  const icons: Record<ICategoriesBadgeProps['category'], ReactNode> = {
    video: <Video size={16} />,
    event: <Calendar size={16} />,
    link: <Link size={16} />
  }

  // The brand's mood palette (LIKQ_AD-1.pdf) used as a categorical scale.
  // Each is a light ground carrying obsidian text, so the badge stays legible
  // over any artwork without needing a scrim.
  const tone: Record<ICategoriesBadgeProps['category'], string> = {
    video: 'bg-genre-rose',
    event: 'bg-genre-gold',
    link: 'bg-genre-mint'
  }

  return (
    <span
      className={cn([
        'copy-th inline-flex self-start items-center gap-1.5 rounded-full px-3 py-1 text-xs text-likq-obsidian',
        tone[category],
        className
      ])}
    >
      {icons[category]}

      {category && (
        <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
      )}
    </span>
  )
}

export default CategoriesBadge
