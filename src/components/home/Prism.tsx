import React from 'react'
import Link from 'next/link'
import { MarkArrow } from './marks'

/**
 * The prism. One beam arrives, two leave: the whole reason this page can serve
 * a client and a fan without becoming a brochure for neither. Everything below
 * this point belongs to one lane or the other, and keeps that lane's colour.
 *
 * The two panels are the page's primary actions and are sized to say so.
 */

const paths = [
  {
    href: '#make',
    lane: 'navy' as const,
    en: 'Crafting Your Vibe',
    th: 'อยากได้เพลงของคุณเอง',
    body: 'เพลง Original, เพลงประกอบโฆษณา, แฟนซอง และงานมิกซ์–มาสเตอร์ริ่ง ทำงานกับทีมโปรดิวเซอร์ของเราตั้งแต่ต้นจนจบ',
    action: 'ดูบริการและผลงาน'
  },
  {
    href: '#label',
    lane: 'lavender' as const,
    en: 'Defining Your Sound',
    th: 'อยากรู้จักศิลปินของเรา',
    body: 'ศิลปินฝึกหัด ผลงานเพลง เสื้อผ้าและของสะสม รวมถึงออดิชั่นสำหรับคนที่อยากขึ้นเวทีกับเรา',
    action: 'เข้าไปดูค่าย'
  }
]

const Prism = () => {
  return (
    <section id="prism" className="station">
      <div className="station-inner">
        {/* The split, drawn. One beam in, two out — and the two land on the
            panels below rather than shooting past them to the page edges,
            because where the light goes is the whole point of the section. */}
        <div className="relative mx-auto h-44 w-full md:h-60">
          <svg
            viewBox="0 0 400 160"
            preserveAspectRatio="none"
            aria-hidden
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="beam-left" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.62" />
                <stop offset="100%" stopColor="#8FA2F5" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="beam-right" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.62" />
                <stop offset="100%" stopColor="#E0C4F2" stopOpacity="0.08" />
              </linearGradient>
            </defs>
            <path d="M197 0 L203 0 L203 52 L197 52 Z" fill="#ffffff" opacity="0.8" />
            {/* Each wedge ends over its panel's inner half. */}
            <path d="M186 104 L200 118 L152 160 L44 160 Z" fill="url(#beam-left)" />
            <path d="M214 104 L200 118 L248 160 L356 160 Z" fill="url(#beam-right)" />
          </svg>
          <svg
            viewBox="0 0 60 52"
            aria-hidden
            className="absolute left-1/2 top-[30%] h-16 w-[4.5rem] -translate-x-1/2 text-white md:h-20 md:w-24"
          >
            <path
              d="M30 4 L56 48 L4 48 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 md:mt-6 md:grid-cols-2 md:gap-6">
          {paths.map(path => (
            <Link
              key={path.href}
              href={path.href}
              className={`group relative flex min-h-[17rem] flex-col justify-between overflow-hidden rounded-[2rem] p-8 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(16,6,159,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:min-h-[20rem] md:p-11 ${
                path.lane === 'navy'
                  ? 'panel-ink ring-1 ring-inset ring-white/15'
                  : 'panel-lavender'
              }`}
            >
              <div>
                <p className="display-lockup text-[clamp(2rem,4.4vw,3.25rem)]">
                  {path.en}
                </p>
                <p
                  className={`copy-th mt-4 text-lg font-bold md:text-xl ${
                    path.lane === 'navy' ? 'text-white' : 'text-likq-ink'
                  }`}
                >
                  {path.th}
                </p>
                <p
                  className={`copy-th mt-4 max-w-sm text-sm md:text-base ${
                    path.lane === 'navy' ? 'text-white/85' : 'text-likq-ink/80'
                  }`}
                >
                  {path.body}
                </p>
              </div>
              <span className="copy-th mt-8 inline-flex items-center gap-3 text-sm font-bold md:text-base">
                {path.action}
                <MarkArrow className="h-5 w-5 transition-transform duration-500 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Prism
