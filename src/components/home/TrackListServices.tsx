'use client'

import React from 'react'
import Link from 'next/link'
import SectionHead from './SectionHead'

const SERVICES = [
  { en: 'Writing and Composing', th: 'แต่งเพลงและแต่งทำนอง' },
  { en: 'Edit & Tune Vocal', th: 'จูนและแก้ไขเสียงร้อง' },
  { en: 'Arrange Music', th: 'เรียบเรียงดนตรี' },
  { en: 'Mix & Mastering', th: 'ผสมเสียงและมาสเตอร์' },
  { en: 'Advertised', th: 'แต่งเพลง ผลิตเพลง ประกอบโฆษณา' },
  { en: 'Music & Gift', th: 'Fansong ของขวัญ เนื่องในโอกาสพิเศษ' }
]

/**
 * Services rendered as a record's track list: numbered rows, big type, one
 * hover state. The numbering is the brand system here (tracks on a side),
 * not section scaffolding.
 */
const TrackListServices = () => {
  return (
    <section id="services" className="bg-ink-deep px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead th="บริการของเรา" en="Services · Side A" />
        <p className="mt-6 max-w-2xl text-base md:text-lg text-ink-muted">
          บริการผลิตดนตรีหลากหลายรูปแบบ พร้อมทีมงานมืออาชีพมากประสบการณ์
        </p>

        <ol className="mt-10 md:mt-14">
          {SERVICES.map((s, i) => (
            <li key={s.en} className="border-b border-ink-line first:border-t">
              <Link
                href="#contact"
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-5 px-2 py-6 transition-colors duration-200 hover:bg-ink-raise focus-visible:bg-ink-raise focus-visible:outline-none md:grid-cols-[5rem_1fr_auto] md:gap-x-8 md:px-4 md:py-7"
              >
                <span className="font-archivo text-sm font-semibold tabular-nums tracking-[0.18em] text-secondary md:text-base">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block font-archivo text-2xl font-bold tracking-[-0.01em] text-ink-text transition-transform duration-200 group-hover:translate-x-2 md:text-4xl">
                    {s.en}
                  </span>
                  <span className="mt-1 block text-sm text-ink-muted md:text-base">
                    {s.th}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="hidden font-archivo text-xl text-secondary opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 md:block"
                >
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default TrackListServices
