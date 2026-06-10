'use client'

import React, { useState } from 'react'
import SectionHead from '@/components/home/SectionHead'
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
    <section id="work" className="bg-ink-deep px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
      <SectionHead th="ผลงานของเรา" en="Works" />
      <p className="mt-6 max-w-2xl text-base md:text-lg text-ink-muted">
        ตัวอย่างผลงานของ LiKQ Music
      </p>

      <div className="flex gap-2 md:gap-3 mt-10 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-2 rounded-full transition-all duration-300 border
              ${
                activeTab === tab.id
                  ? 'bg-secondary text-primary border-secondary font-bold'
                  : 'bg-transparent text-ink-muted border-ink-line hover:border-secondary hover:text-secondary'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 items-start w-full">
        {filteredItems.map((item, index) => (
          <WorkItem
            key={`${item.title}-${index}`}
            imageUrl={item.image || ''}
            name={item.title}
            category={item.category}
            onClick={() => handleItemClick(item)}
            className="animate-scale-in"
          />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedItem && <WorkDetail item={selectedItem} />}
      </Modal>
      </div>
    </section>
  )
}

export default Works
