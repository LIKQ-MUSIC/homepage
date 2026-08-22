'use client'

import React, { useState } from 'react'
import WorkDetail from './_components/WorkDetail'
import { IWorkItem } from '@/components/Works/types'
import WorkItem from './_components/WorkItem'
import Modal from '@/ui/Modal'
import { useVideosListDetails } from '@/hooks/api'

interface WorksProps {
  items: IWorkItem[]
}

const Works = ({ items = [] }: WorksProps) => {
  const [selectedItem, setSelectedItem] = useState<IWorkItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const videoIds = items
    .filter(item => item.category === 'video')
    .map(item => item.youtubeId || '')

  const { data: videoData } = useVideosListDetails(videoIds)

  const displayItems = items.map(item => {
    if (item.category === 'video' && videoData) {
      const details = videoData.find(v => v.videoId === item.youtubeId)
      return {
        ...item,
        image: details?.thumbnailUrl || item.image,
        title: details?.title || item.title
      }
    }
    return item
  })

  const filteredItems = displayItems.filter(item => {
    if (activeTab === 'all') return true
    if (activeTab === 'music') return item.category === 'video'
    return item.category === activeTab
  })

  const handleItemClick = (item: IWorkItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Optional: Clear selected item after animation or immediately
    // setSelectedItem(null)
  }

  const tabs = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'music', label: 'เพลง' },
    { id: 'event', label: 'Event' },
    { id: 'link', label: 'Link' }
  ]

  return (
    <section id="work" className="station">
      <div className="station-inner">
        <h2 className="station-title text-white">ผลงานของเรา</h2>
        <p className="station-lede mt-6 text-white/80">
          ตัวอย่างผลงานของ LiKQ Music
        </p>

        <div
          className="mt-10 flex flex-wrap gap-2 md:gap-3"
          role="group"
          aria-label="กรองผลงานตามประเภท"
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`copy-th rounded-full px-6 py-2 text-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:text-base ${
                activeTab === tab.id
                  ? 'bg-white font-bold text-likq-ink'
                  : 'bg-white/15 text-white/90 hover:bg-white/25 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* The first work runs wide: density varies inside the lane rather
            than every item sitting in an identical cell. */}
        <div className="mt-10 grid w-full grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <WorkItem
              key={`${item.title}-${index}`}
              imageUrl={item.image || ''}
              name={item.title}
              category={item.category}
              onClick={() => handleItemClick(item)}
              className={index === 0 ? 'md:col-span-2' : undefined}
              wide={index === 0}
            />
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          label={selectedItem?.title}
        >
          {selectedItem && <WorkDetail item={selectedItem} />}
        </Modal>
      </div>
    </section>
  )
}

export default Works
