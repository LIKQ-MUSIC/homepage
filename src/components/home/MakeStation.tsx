import React from 'react'
import Link from 'next/link'
import {
  MarkArrange,
  MarkArrow,
  MarkBroadcast,
  MarkGift,
  MarkMix,
  MarkPen,
  MarkVoice
} from './marks'

const CHAIN = [
  { en: 'Writing and Composing', th: 'แต่งเพลงและแต่งทำนอง', Mark: MarkPen },
  { en: 'Edit & Tune Vocal', th: 'จูนและแก้ไขเสียงร้อง', Mark: MarkVoice },
  { en: 'Arrange Music', th: 'เรียบเรียงดนตรี', Mark: MarkArrange },
  { en: 'Mix & Mastering', th: 'ผสมเสียงและมาสเตอร์', Mark: MarkMix }
]

const APPLIED = [
  {
    en: 'Advertised',
    th: 'แต่งเพลง ผลิตเพลง ประกอบโฆษณา',
    Mark: MarkBroadcast
  },
  {
    en: 'Music & Gift',
    th: 'Fansong ของขวัญ เนื่องในโอกาสพิเศษ',
    Mark: MarkGift
  }
]

const MakeStation = () => (
  <section id="make" className="station">
    <div className="station-inner grid gap-10 lg:grid-cols-[0.8fr_1.6fr] lg:gap-16">
      <div>
        <h2 className="station-title text-white">บริการของเรา</h2>
        <p className="station-lede mt-5 text-white/85">
          บริการผลิตดนตรีหลากหลายรูปแบบ พร้อมทีมงานมืออาชีพมากประสบการณ์
        </p>
        <Link
          href="#contact"
          className="copy-th mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold text-likq-ink transition-colors hover:bg-likq-lavender-pale focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          เริ่มโปรเจกต์กับเรา
          <MarkArrow className="h-4 w-4" />
        </Link>
      </div>
      <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {[...CHAIN, ...APPLIED].map(({ en, th, Mark }) => (
          <li key={en} className="flex items-start gap-4">
            <Mark className="mt-1 h-6 w-6 shrink-0 text-likq-beam6" />
            <div>
              <h3 className="display-mixed text-[1.5rem] text-white md:text-[1.7rem]">
                {en}
              </h3>
              <p className="copy-th mt-2 text-sm text-white/85">{th}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default MakeStation
