import Image from 'next/image'
import { Category } from '@/components/Works/types'
import CategoriesBadge from '@/components/Works/_components/CategoriesBadge'
import { cn } from '@/utils/cn'

interface WorkItemProps {
  imageUrl: string
  name: string
  category: Category
  onClick: () => void
  className?: string
  /** The lane's opening work runs wide and taller. */
  wide?: boolean
}

const WorkItem = ({
  imageUrl,
  name,
  category,
  onClick,
  className,
  wide = false
}: WorkItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative block w-full cursor-pointer overflow-hidden rounded-[1.5rem] bg-white/[0.06] text-left transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className
      )}
    >
      <CategoriesBadge
        className="absolute left-3 top-3 z-10"
        category={category}
      />

      <div
        className={cn(
          'relative w-full overflow-hidden',
          wide ? 'aspect-[16/9] md:aspect-[2/1]' : 'aspect-[16/9]'
        )}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes={
              wide
                ? '(max-width: 768px) 100vw, 66vw'
                : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-likq-ink/50">
            <span className="copy-th text-sm text-white/80">
              ยังไม่มีภาพปก
            </span>
          </div>
        )}
        {/* The lens catches the work: a soft rim of light on hover, not a
            border that is always on. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
          style={{
            background:
              'radial-gradient(80% 60% at 50% 110%, rgba(192,117,228,0.55) 0%, rgba(192,117,228,0) 70%)'
          }}
        />
      </div>

      <div className="p-5">
        <h3
          className={cn(
            'copy-th line-clamp-2 text-white transition-colors group-hover:text-likq-beam6',
            wide ? 'text-lg md:text-2xl' : 'text-base md:text-lg'
          )}
        >
          {name}
        </h3>
      </div>
    </button>
  )
}

export default WorkItem
