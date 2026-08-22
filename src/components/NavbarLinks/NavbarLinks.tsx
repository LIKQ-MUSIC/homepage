'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Kind = 'text' | 'secondary' | 'primary'

/**
 * The bar mirrors the page's fork: the making side first, then the label side
 * (artists, store, quiz), then the two standing calls to action.
 *
 * /merch and /capybara are proxied routes (see next.config rewrites) and both
 * serve on production; before this they had no entry point anywhere on the
 * site.
 */
const links: { href: string; label: string; kind: Kind; isRoute?: boolean }[] = [
  { href: '#make', label: 'บริการ', kind: 'text' },
  { href: '#work', label: 'ผลงาน', kind: 'text' },
  { href: '/artists', label: 'ศิลปิน', kind: 'text', isRoute: true },
  { href: '/merch', label: 'Store', kind: 'text', isRoute: true },
  { href: '/capybara', label: 'ควิซ', kind: 'text', isRoute: true },
  { href: '/partner', label: 'ฝากขาย', kind: 'secondary', isRoute: true },
  { href: '/audition', label: 'Audition', kind: 'primary', isRoute: true }
]

const NavbarLinks = ({ isScrolled }: { isScrolled?: boolean }) => {
  const pathname = usePathname()

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (pathname !== '/') return // let "/#section" navigate from other pages
    e.preventDefault()
    const section = document.querySelector(href)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      history.pushState(null, '', href)
    }
  }

  const styleFor = (kind: Kind, isActive: boolean): string => {
    if (kind === 'text') {
      return isScrolled
        ? 'px-3 py-2 text-likq-ink/80 hover:text-likq-ink'
        : 'px-3 py-2 text-white/85 hover:text-white'
    }
    if (kind === 'primary') {
      return isScrolled
        ? 'px-5 py-2 rounded-full bg-likq-navy text-white hover:bg-likq-ink'
        : 'px-5 py-2 rounded-full bg-white text-likq-ink hover:bg-likq-lavender-pale'
    }
    if (isActive) {
      return isScrolled
        ? 'px-5 py-2 rounded-full border border-likq-navy bg-likq-navy/10 text-likq-ink'
        : 'px-5 py-2 rounded-full border border-white bg-white/20 text-white'
    }
    return isScrolled
      ? 'px-5 py-2 rounded-full border border-likq-navy/40 text-likq-ink hover:bg-likq-navy hover:text-white'
      : 'px-5 py-2 rounded-full border border-white/50 text-white hover:bg-white/15'
  }

  return (
    <div className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {links.map(({ href, label, kind, isRoute }) => {
          const isActive = !!isRoute && pathname === href
          const resolvedHref = isRoute ? href : `/${href}`

          return (
            <li key={label} className={kind === 'secondary' ? 'ml-2' : ''}>
              <Link
                href={resolvedHref}
                aria-current={isActive ? 'page' : undefined}
                onClick={isRoute ? undefined : e => handleClick(e, href)}
                className={`copy-th block whitespace-nowrap text-[15px] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${styleFor(
                  kind,
                  isActive
                )}`}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default NavbarLinks
