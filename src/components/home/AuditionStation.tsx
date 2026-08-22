import React from 'react'
import Link from 'next/link'
import { Glint, MarkArrow } from './marks'

/**
 * The label lane's call. Copy carried over verbatim from the previous audition
 * band; "เปิดรับสมัครแล้ว" now reads as the status it actually is — a live
 * open-call badge sitting with the heading — rather than as a tracked label
 * floating above it.
 */
const AuditionStation = () => {
  return (
    <section id="audition-call" className="station">
      <div className="station-inner">
        <div className="panel-ink relative overflow-hidden rounded-[2.5rem] px-8 py-14 md:px-16 md:py-20">
          <Glint className="absolute right-[12%] top-[18%] h-7 w-7 animate-glint text-likq-lavender" />
          <Glint
            className="absolute left-[8%] bottom-[16%] h-4 w-4 animate-glint text-white/60"
            style={{ animationDelay: '2s' }}
          />

          <span className="copy-th inline-flex items-center gap-2 rounded-full bg-likq-beam6 px-4 py-1.5 text-sm font-bold text-likq-ink">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-likq-ink"
            />
            เปิดรับสมัครแล้ว
          </span>

          <h2 className="display-lockup mt-7 text-[clamp(3rem,10vw,7.5rem)] text-white">
            AUDITION
          </h2>
          <p className="copy-th mt-3 text-xl text-white md:text-3xl">
            ออดิชั่น Idol · LiKQ Music
          </p>
          <p className="copy-th mt-6 max-w-xl text-base text-white/85 md:text-lg">
            เรากำลังมองหาเสียงร้อง ความคิดสร้างสรรค์ และศิลปินหน้าใหม่ มาร่วมวง
            idol ของเรา · ไม่ต้องมีประสบการณ์ ขอแค่แพสชั่นและศักยภาพ
          </p>

          <Link
            href="/audition"
            className="copy-th mt-11 inline-flex items-center gap-3 rounded-full bg-white px-10 py-4 text-lg font-bold text-likq-ink transition-transform duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            สมัครเลย
            <MarkArrow className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AuditionStation
