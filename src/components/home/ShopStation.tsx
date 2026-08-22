import React from 'react'
import Link from 'next/link'
import { Glint, MarkArrow, MarkBag, MarkQuiz } from './marks'

/**
 * The two places the label lets you in that were previously unreachable from
 * the homepage: the merch store and the capybara quiz. Both are real routes
 * proxied through next.config rewrites and live on production.
 *
 * Their copy is the destinations' own — the quiz's real title and question
 * count, the store's real name — so neither panel promises something the page
 * behind it does not say.
 */

const DESTINATIONS = [
  {
    href: '/merch',
    Mark: MarkBag,
    title: 'LiKQ Store',
    body: 'เสื้อผ้า ของสะสม และสินค้าจากค่าย ส่งตรงถึงบ้าน',
    action: 'เข้าร้าน',
    tone: 'ink' as const
  },
  {
    href: '/capybara',
    Mark: MarkQuiz,
    title: 'เวลามีใจให้ใครสักคน คุณเป็นคาปิบาร่าแบบไหน?',
    body: 'ควิซ 11 ข้อ ค้นหาคาปิบาร่าที่ตรงกับสไตล์ความรักของคุณ 8 ตัว 8 ไวบ์',
    action: 'เล่นควิซ',
    tone: 'rose' as const
  }
]

const ShopStation = () => {
  return (
    <section id="shop" className="station">
      <div className="station-inner">
        <h2 className="station-title text-likq-ink">แวะเล่นกับเรา</h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {DESTINATIONS.map(({ href, Mark, title, body, action, tone }) => (
            <Link
              key={href}
              href={href}
              className={`group relative flex min-h-[16rem] flex-col justify-between overflow-hidden rounded-[2rem] p-8 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(16,6,159,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-likq-ink motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-10 ${
                tone === 'ink'
                  ? 'panel-ink'
                  : 'bg-genre-rose text-likq-obsidian'
              }`}
            >
              <Glint
                className={`absolute right-7 top-7 h-5 w-5 ${
                  tone === 'ink' ? 'text-likq-lavender' : 'text-likq-navy'
                }`}
              />
              <Mark className="h-8 w-8" />
              <div className="mt-10">
                <p className="copy-th text-xl font-bold md:text-2xl">{title}</p>
                <p
                  className={`copy-th mt-3 max-w-sm text-sm md:text-base ${
                    tone === 'ink' ? 'text-white/80' : 'text-likq-obsidian/80'
                  }`}
                >
                  {body}
                </p>
                <span className="copy-th mt-7 inline-flex items-center gap-3 text-sm font-bold md:text-base">
                  {action}
                  <MarkArrow className="h-5 w-5 transition-transform duration-500 ease-out group-hover:translate-x-1.5 motion-reduce:transition-none" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopStation
