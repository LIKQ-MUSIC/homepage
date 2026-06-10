import React from 'react'
import Image from 'next/image'
import Button from '@/ui/Button'
import SectionHead from './SectionHead'

/**
 * About section: copy carried over verbatim from the old AboutUs block,
 * recomposed as an asymmetric split with the label's real photos.
 */
const AboutSplit = () => {
  return (
    <section id="about-us" className="bg-ink-deep px-5 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHead th="เกี่ยวกับเรา" en="About" />

        <div className="mt-10 grid grid-cols-1 gap-12 md:mt-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <p className="text-xl md:text-2xl leading-relaxed text-ink-text">
              <strong className="font-prompt">LiKQ Music</strong>{' '}
              คือทีมผลิตดนตรีครบวงจรที่มุ่งเน้นคุณภาพและความคิดสร้างสรรค์
              เราเชี่ยวชาญในงาน{' '}
              <strong className="text-secondary">Music Production</strong>{' '}
              ทุกขั้นตอน ตั้งแต่การเขียนเนื้อร้อง แต่งทำนอง เรียบเรียงดนตรี
              ไปจนถึงการมิกซ์และมาสเตอร์ริ่ง
            </p>
            <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-ink-muted">
              ไม่ว่าจะเป็นเพลง Original สำหรับศิลปิน, เพลงประกอบโฆษณา, แฟนซอง
              หรือโปรเจกต์พิเศษต่าง ๆ
              เราพร้อมดูแลและให้คำปรึกษาด้วยทีมงานมืออาชีพ
              เพื่อให้ได้ผลงานที่ตรงตามวิสัยทัศน์ของคุณมากที่สุด
            </p>
            <div className="mt-10">
              <Button
                href="#work"
                variant="onDarkOutline"
                className="h-auto rounded-full px-8 py-3"
              >
                ดูผลงานของเรา
              </Button>
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/images/about/group-photo.jpg"
                alt="ทีม LIKQ Music ถ่ายภาพหมู่ร่วมกันหลังงานแสดง"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
            <div className="relative ml-auto -mt-12 w-3/4 md:-mt-16">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm border-4 border-ink-deep">
                <Image
                  src="/images/about/team-studio.jpg"
                  alt="ทีมงานระหว่างทำงานในสตูดิโอ"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 30vw, 75vw"
                />
              </div>
              <div className="absolute -bottom-3 -left-3 -z-10 h-full w-full bg-secondary/35" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSplit
