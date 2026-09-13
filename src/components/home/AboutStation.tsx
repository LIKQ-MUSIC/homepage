import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MarkArrow } from './marks'

const AboutStation = () => {
  return (
    <section id="about-us" className="station">
      <div className="station-inner">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <h2 className="station-title text-white">เกี่ยวกับเรา</h2>
            <p className="copy-th mt-8 text-lg text-white md:text-2xl">
              <strong className="font-bold">LiKQ Music</strong>{' '}
              คือทีมผลิตดนตรีครบวงจรที่มุ่งเน้นคุณภาพและความคิดสร้างสรรค์
              เราเชี่ยวชาญในงาน{' '}
              {/* Not a tint: every lavender on this field lands under 4.5:1
                  at body size, so weight carries the emphasis instead. */}
              <strong className="font-bold">Music Production</strong> ทุกขั้นตอน
              ตั้งแต่การเขียนเนื้อร้อง แต่งทำนอง เรียบเรียงดนตรี
              ไปจนถึงการมิกซ์และมาสเตอร์ริ่ง
            </p>
            <p className="copy-th mt-6 max-w-xl text-base text-white/85 md:text-lg">
              ไม่ว่าจะเป็นเพลง Original สำหรับศิลปิน, เพลงประกอบโฆษณา, แฟนซอง
              หรือโปรเจกต์พิเศษต่าง ๆ
              เราพร้อมดูแลและให้คำปรึกษาด้วยทีมงานมืออาชีพ
              เพื่อให้ได้ผลงานที่ตรงตามวิสัยทัศน์ของคุณมากที่สุด
            </p>
            <Link
              href="#work"
              className="copy-th mt-10 inline-flex items-center gap-3 rounded-full border border-white/45 px-8 py-3.5 text-base text-white transition-colors duration-300 hover:bg-white hover:text-likq-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              ดูผลงานของเรา
              <MarkArrow className="h-5 w-5" />
            </Link>
          </div>

          {/* A wide frame and a lens. The group shot keeps its full frame — a
              circular mask on a wide group photo crops the people out, which is
              the opposite of what this section is for — and the lens holds the
              smaller studio shot, where the brand device actually works. */}
          <div className="relative md:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem]">
              <Image
                src="/images/about/group-photo.jpg"
                alt="ทีม LIKQ Music ถ่ายภาพหมู่ร่วมกันหลังงานแสดง"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
            <div className="q-aperture relative -mt-14 ml-auto aspect-square w-[44%] shadow-[0_18px_50px_-22px_rgba(6,3,60,0.85)] ring-[6px] ring-likq-navy md:-mt-16 md:w-[52%]">
              <Image
                src="/images/about/team-studio.jpg"
                alt="ทีมงานระหว่างทำงานในสตูดิโอ"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 22vw, 44vw"
              />
            </div>
          </div>
        </div>

        <details className="group mt-10 rounded-2xl bg-white/[0.06] px-6 py-2 md:px-8">
          <summary className="copy-th cursor-pointer py-4 text-base text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            เรื่องเล่าผ่านสีของเรา
          </summary>
          <div className="grid gap-6 pb-4 pt-2 md:grid-cols-2">
            <div className="text-white">
              <p className="display-lockup text-[clamp(1.75rem,3.4vw,2.5rem)]">
                Navy
              </p>
              <p className="copy-th mt-3 text-sm text-white/85">
                สีกรมท่า คือความลึกซึ้งและมั่นคง เหมือนทะเลลึกที่ไม่เคยหยุดนิ่ง
                สะท้อนถึงความตั้งใจ ความเป็นมืออาชีพ
                และรากฐานที่แข็งแกร่งของพวกเรา
              </p>
            </div>
            <div className="text-white">
              <p className="display-lockup text-[clamp(1.75rem,3.4vw,2.5rem)]">
                Lavender
              </p>
              <p className="copy-th mt-3 text-sm text-white/85">
                สีลาเวนเดอร์ คือจินตนาการและความคิดสร้างสรรค์
                เหมือนกลิ่นหอมที่ปลุกแรงบันดาลใจ สะท้อนถึงความฝัน ความอ่อนโยน
                และเอกลักษณ์ที่ไม่เหมือนใคร
              </p>
            </div>
          </div>

          <p className="copy-th mb-5 mt-3 max-w-3xl text-sm text-white/85">
            เมื่อสองสีนี้มาบรรจบกัน มันคือตัวตนของ LIKQ
            ความสมดุลระหว่างความมั่นคงกับจินตนาการ
            ระหว่างความเป็นมืออาชีพกับความกล้าที่จะแตกต่าง
            เราเชื่อว่าทุกเสียงเพลงเกิดจากเรื่องราว และนี่คือเรื่องราวของเรา
          </p>
        </details>
      </div>
    </section>
  )
}

export default AboutStation
