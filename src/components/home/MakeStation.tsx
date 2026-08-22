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

/**
 * The client lane opens here. Services are not a numbered tracklist and not a
 * card grid — they are the path a sound takes through the studio, drawn as one
 * continuous spine whose colour shifts from navy to lavender as the work moves
 * from raw idea to finished master.
 *
 * Copy carried over verbatim from the previous services block.
 */

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

const MakeStation = () => {
  return (
    <section id="make" className="station">
      <div className="station-inner">
        {/* The client lane runs left. Everything in it holds this bias. */}
        <div className="max-w-3xl">
          <h2 className="station-title text-white">บริการของเรา</h2>
          <p className="station-lede mt-6 text-white/85">
            บริการผลิตดนตรีหลากหลายรูปแบบ พร้อมทีมงานมืออาชีพมากประสบการณ์
          </p>
        </div>

        <ol className="relative mt-14 md:mt-20">
          {/* The spine. It is the beam, narrowed to a working line. */}
          <span
            aria-hidden
            className="absolute left-[1.375rem] top-5 bottom-5 w-[2px] rounded-full bg-gradient-to-b from-white/85 via-likq-beam6/80 to-likq-beam6/25 md:left-[1.6875rem]"
          />
          {CHAIN.map(({ en, th, Mark }) => (
            <li
              key={en}
              className="relative flex items-start gap-6 pb-12 pl-0 last:pb-0 md:gap-10"
            >
              <span className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-likq-ink text-white ring-1 ring-white/35 md:h-14 md:w-14">
                <Mark className="h-5 w-5 md:h-6 md:w-6" />
              </span>
              <span className="min-w-0 pt-1">
                <span className="display-lockup block text-[clamp(1.75rem,4.6vw,3.25rem)] text-white">
                  {en}
                </span>
                <span className="copy-th mt-1 block text-sm text-white/85 md:text-base">
                  {th}
                </span>
              </span>
            </li>
          ))}
        </ol>

        {/* Applied work sits off the spine: same craft, different destination. */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-20">
          {APPLIED.map(({ en, th, Mark }) => (
            <div key={en} className="panel-lavender rounded-[1.75rem] p-7 md:p-9">
              <Mark className="h-7 w-7 text-likq-navy" />
              <p className="display-lockup mt-6 text-[clamp(1.5rem,3.2vw,2.25rem)] text-likq-ink">
                {en}
              </p>
              <p className="copy-th mt-2 text-sm text-likq-ink/80 md:text-base">
                {th}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="#contact"
          className="copy-th mt-14 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-likq-ink transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
          เริ่มโปรเจกต์กับเรา
          <MarkArrow className="h-5 w-5" />
        </Link>
      </div>
    </section>
  )
}

export default MakeStation
