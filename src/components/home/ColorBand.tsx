import React from 'react'
import SectionHead from './SectionHead'

/**
 * The color story as a drenched split band: the left half IS navy, the right
 * half IS lavender. Copy carried over verbatim from the old ColorStory.
 */
const ColorBand = () => {
  return (
    <section id="our-story" className="bg-ink-deep px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead th="เรื่องเล่าผ่านสีของเรา" en="Our Story" />
      </div>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 md:mt-14 md:grid-cols-2">
        <div className="bg-primary p-8 md:p-14">
          <p className="font-archivo text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Navy
          </p>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-ink-text">
            สีกรมท่า คือความลึกซึ้งและมั่นคง เหมือนทะเลลึกที่ไม่เคยหยุดนิ่ง —
            สะท้อนถึงความตั้งใจ ความเป็นมืออาชีพ
            และรากฐานที่แข็งแกร่งของพวกเรา
          </p>
        </div>
        <div className="bg-secondary p-8 md:p-14">
          <p className="font-archivo text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Lavender
          </p>
          <p className="mt-6 text-lg md:text-xl leading-relaxed text-primary">
            สีลาเวนเดอร์ คือจินตนาการและความคิดสร้างสรรค์
            เหมือนกลิ่นหอมที่ปลุกแรงบันดาลใจ — สะท้อนถึงความฝัน ความอ่อนโยน
            และเอกลักษณ์ที่ไม่เหมือนใคร
          </p>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-2xl px-2 text-center text-base md:text-lg leading-relaxed text-ink-muted">
        เมื่อสองสีนี้มาบรรจบกัน มันคือตัวตนของ LIKQ —
        ความสมดุลระหว่างความมั่นคงกับจินตนาการ
        ระหว่างความเป็นมืออาชีพกับความกล้าที่จะแตกต่าง
        เราเชื่อว่าทุกเสียงเพลงเกิดจากเรื่องราว และนี่คือเรื่องราวของเรา
      </p>
    </section>
  )
}

export default ColorBand
