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
        {/* The split, drawn.

            What makes a prism legible is dispersion: white light in, DIFFERENT
            colours out. An earlier pass drew both exit beams the same pale
            white-blue with hard edges, and it read as a tent rather than a
            prism. Each beam now carries the colour of the lane it feeds — blue
            into the navy panel, lavender into the lavender one — and both fade
            as they travel, so they read as light rather than as flat shapes. */}
        <div className="relative mx-auto h-48 w-full md:h-64">
          <svg
            viewBox="0 0 400 200"
            preserveAspectRatio="none"
            aria-hidden
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              {/* Soft-edged incoming shaft: feathered across, fading in. */}
              <linearGradient id="prism-in" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="prism-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              {/* Exit beams: coloured at the prism, spent by the time they
                  reach their panel. userSpaceOnUse so the falloff runs along
                  the beam, not across the bounding box. */}
              <linearGradient
                id="beam-left"
                gradientUnits="userSpaceOnUse"
                x1="196"
                y1="140"
                x2="40"
                y2="200"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                <stop offset="22%" stopColor="#5766E0" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2242DA" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="beam-right"
                gradientUnits="userSpaceOnUse"
                x1="204"
                y1="140"
                x2="360"
                y2="200"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                <stop offset="22%" stopColor="#D9A6F0" stopOpacity="0.62" />
                <stop offset="100%" stopColor="#C075E4" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* incoming */}
            <rect x="190" y="0" width="20" height="92" fill="url(#prism-in)" />

            {/* Scatter at the split, where the light actually separates. */}
            <ellipse cx="200" cy="140" rx="46" ry="16" fill="url(#prism-glow)" />

            {/* exit beams */}
            <path d="M172 138 L200 138 L150 200 L14 200 Z" fill="url(#beam-left)" />
            <path d="M228 138 L200 138 L250 200 L386 200 Z" fill="url(#beam-right)" />
          </svg>

          {/* The prism itself, drawn in its own square viewBox so the glass
              keeps its proportions while the beams stretch with the column. */}
          <svg
            viewBox="0 0 100 80"
            aria-hidden
            className="absolute left-1/2 top-[33%] h-[5.25rem] w-[6.5rem] -translate-x-1/2 md:h-28 md:w-32"
          >
            <defs>
              <linearGradient id="prism-body" x1="0" y1="0" x2="0.7" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#C075E4" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M50 6 L92 74 L8 74 Z"
              fill="url(#prism-body)"
              stroke="#ffffff"
              strokeOpacity="0.9"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* The lit edge, where the beam enters. */}
            <path
              d="M50 6 L8 74"
              stroke="#ffffff"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
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
