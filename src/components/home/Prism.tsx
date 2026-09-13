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
    body: 'ศิลปินฝึกหัด ผลงานเพลง เสื้อผ้าและของสะสมจากค่ายของเรา',
    action: 'เข้าไปดูค่าย'
  }
]

const Prism = () => {
  return (
    <section id="prism" className="station">
      <div className="station-inner">
        {/* One coordinate system keeps the light joined to the prism at every width. */}
        <div className="mx-auto w-full max-w-3xl" aria-hidden="true">
          <svg
            viewBox="0 0 720 240"
            fill="none"
            className="block h-auto w-full"
          >
            <defs>
              <linearGradient
                id="prism-in"
                x1="360"
                y1="0"
                x2="360"
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" stopOpacity="0" />
                <stop offset="1" stopColor="white" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient
                id="prism-left"
                x1="342"
                y1="142"
                x2="120"
                y2="240"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" stopOpacity="0.65" />
                <stop offset="0.3" stopColor="currentColor" stopOpacity="0.5" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="prism-right"
                x1="378"
                y1="142"
                x2="600"
                y2="240"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" stopOpacity="0.65" />
                <stop offset="0.3" stopColor="currentColor" stopOpacity="0.5" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="prism-body"
                x1="324"
                y1="102"
                x2="396"
                y2="162"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" stopOpacity="0.2" />
                <stop offset="1" stopColor="white" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            <path d="M357 0 H363 V99 H357 Z" fill="url(#prism-in)" />
            <path
              d="M345 136 L355 153 L164 240 H72 Z"
              fill="url(#prism-left)"
              className="text-likq-beam3"
            />
            <path
              d="M375 136 L365 153 L556 240 H648 Z"
              fill="url(#prism-right)"
              className="text-likq-beam6"
            />
            <path
              d="M360 84 L408 164 H312 Z"
              fill="url(#prism-body)"
              stroke="white"
              strokeOpacity="0.75"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M360 99 V129 L339 151 M360 129 L381 151"
              stroke="white"
              strokeOpacity="0.65"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M360 84 L312 164"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
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
                <h2 className="display-lockup max-w-[9ch] text-balance text-[clamp(2rem,4.4vw,3.25rem)]">
                  {path.en}
                </h2>
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
                <MarkArrow className="h-5 w-5 transition-transform duration-500 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Prism
