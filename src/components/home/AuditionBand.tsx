import React from 'react'
import Link from 'next/link'

/**
 * The page's one loud moment: a lavender-drenched audition call before the
 * footer. Copy carried over from the old AuditionCTA.
 */
const AuditionBand = () => {
  return (
    <section className="bg-secondary px-5 py-20 text-primary md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="font-archivo text-sm font-bold uppercase tracking-[0.22em]">
          เปิดรับสมัครแล้ว
        </p>
        <h2 className="mt-4 font-archivo font-extrabold leading-[0.95] tracking-[-0.02em] text-[clamp(3rem,10vw,8rem)]">
          AUDITION
        </h2>
        <p className="mt-2 font-prompt text-xl font-bold md:text-3xl">
          ออดิชั่น Idol — LiKQ Music
        </p>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-primary/80 md:text-lg">
          เรากำลังมองหาเสียงร้อง ความคิดสร้างสรรค์ และศิลปินหน้าใหม่ มาร่วมวง
          idol ของเรา · ไม่ต้องมีประสบการณ์ ขอแค่แพสชั่นและศักยภาพ
        </p>
        <Link
          href="/audition"
          className="mt-10 inline-block rounded-full bg-primary px-10 py-4 font-prompt text-lg font-bold text-ink-text transition-transform duration-200 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none"
        >
          สมัครเลย →
        </Link>
      </div>
    </section>
  )
}

export default AuditionBand
