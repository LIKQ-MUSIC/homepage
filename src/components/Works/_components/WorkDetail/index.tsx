'use client'

import { Loader2, PlayCircle } from 'lucide-react'
import { Paragraph, Title } from '@/ui/Typography'
import { useVideoDetails } from '@/hooks/api/youtube'
import CategoriesBadge from '@/components/Works/_components/CategoriesBadge'
import { IWorkItem } from '@/components/Works/types'
import VideoDetail from '@/components/Works/_components/WorkDetail/_components/VideoDetail'
import { useMemo, useState } from 'react'
import { useImageLoaded } from '@/hooks/use-image-loaded'
import { cn } from '@/utils'
import EventDetail from '@/components/Works/_components/WorkDetail/_components/EventDetail'
import LinkDetail from '@/components/Works/_components/WorkDetail/_components/LinkDetail'

const WorkDetail = ({ item }: { item: IWorkItem }) => {
  const { data, isLoading } = useVideoDetails(
    item.category === 'video' ? item.youtubeId || '' : ''
  )

  const imageSrc = useMemo(
    () =>
      item.category === 'video' && !isLoading
        ? data?.thumbnailUrl
        : item.image || undefined,
    [item, data]
  )

  const { ref, loaded } = useImageLoaded(imageSrc || '')

  // A work with no cover art (or a YouTube lookup that failed) used to render
  // nothing at all, so the modal opened as an empty white box with a lone close
  // button and the scroll locked. Show the work's own text instead.
  if (!imageSrc) {
    return (
      <div className="p-8 md:p-12">
        <h3 className="copy-th text-2xl font-bold text-likq-ink md:text-3xl">
          {item.title}
        </h3>
        {item.description && (
          <p className="copy-th mt-4 max-w-2xl text-base text-likq-obsidian">
            {item.description}
          </p>
        )}
        {item.category !== 'video' && item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="copy-th mt-6 inline-block text-base font-bold text-likq-navy underline-offset-4 hover:underline"
          >
            เปิดลิงก์ผลงาน
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="video-card">
      <div className="thumbnail-section">
        <div className="thumbnail-container">
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            <>
              <a
                href={
                  item.category === 'video'
                    ? `https://youtube.com/watch?v=${item.youtubeId}`
                    : item.url || '#'
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  ref={ref}
                  className={cn([
                    'thumbnail transition-all opacity-0',
                    loaded && 'opacity-1'
                  ])}
                  src={imageSrc || undefined}
                  alt={`thumbnail-${item.title}`}
                />
                {item.category === 'video' && (
                  <PlayCircle className="play-icon" size={32} />
                )}
              </a>
            </>
          )}
        </div>
      </div>

      <div className="video-meta">
        <CategoriesBadge category={item.category} />

        <Title level={5} className="line-clamp-2 text-heading">
          {item.category === 'video' ? data?.title : item.title}
        </Title>

        {item.category === 'event' && <EventDetail {...item} />}
        {item.category === 'link' && <LinkDetail {...item} />}
        {data && item.category === 'video' && <VideoDetail {...data} />}
      </div>
    </div>
  )
}

export default WorkDetail
