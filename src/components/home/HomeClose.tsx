import React from 'react'
import { Glint } from './marks'

/**
 * Where the light lands. The two lanes rejoin, the field has resolved into
 * paper, and the page states what LIKQ says it is in the 2026 brand direction:
 * a creative partner, and a home for people who love music.
 *
 * This is the page's quiet passage. After it, only the team and the contact
 * form remain — nothing here competes with them.
 */
const HomeClose = () => {
  return (
    <section className="station">
      <div className="station-inner relative flex flex-col items-center text-center">
        <Glint className="absolute left-[10%] top-0 h-4 w-4 animate-glint text-likq-lavender" />
        <Glint
          className="absolute right-[12%] top-[38%] h-5 w-5 animate-glint text-likq-navy/60"
          style={{ animationDelay: '2.4s' }}
        />

        <p className="display-lockup text-[clamp(2.25rem,7vw,5.5rem)] text-likq-navy">
          We&rsquo;re Your
          <br />
          Creative Partner
        </p>
        <p className="copy-th mt-8 max-w-lg text-base text-likq-obsidian md:text-lg">
          บ้านของคนรักดนตรี ตั้งแต่คนที่อยากมีเพลงเป็นของตัวเอง
          ไปจนถึงคนที่อยากขึ้นไปยืนบนเวที
        </p>
      </div>
    </section>
  )
}

export default HomeClose
