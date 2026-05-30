'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Kind = 'text' | 'secondary' | 'primary'

const links: { href: string; label: string; kind: Kind; isRoute?: boolean }[] = [
  { href: '#services', label: 'Our Services', kind: 'text' },
  { href: '#work', label: 'Our Work', kind: 'text' },
  { href: '#team', label: 'Our Team', kind: 'text' },
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
        ? 'px-3 py-2 text-primary/80 hover:text-primary'
        : 'px-3 py-2 text-white/90 hover:text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]'
    }
    // Primary CTA: always filled.
    if (kind === 'primary') {
      return isScrolled
        ? 'px-5 py-2 rounded-full bg-primary text-white hover:bg-primary-hover'
        : 'px-5 py-2 rounded-full bg-white text-primary hover:bg-white/90'
    }
    // Secondary CTA: outline pill. When it is the current page, use a subtle
    // tint (not a full fill) so it reads as "active" without competing with
    // the solid primary CTA next to it.
    if (isActive) {
      return isScrolled
        ? 'px-5 py-2 rounded-full border border-primary bg-primary/10 text-primary'
        : 'px-5 py-2 rounded-full border border-white bg-white/20 text-white'
    }
    return isScrolled
      ? 'px-5 py-2 rounded-full border border-primary/40 text-primary hover:bg-primary hover:text-white'
      : 'px-5 py-2 rounded-full border border-white/50 text-white hover:bg-white/15'
  }

  return (
    <div className="hidden lg:block">
      <ul className="flex items-center gap-1.5">
        {links.map(({ href, label, kind, isRoute }) => {
          const isActive = !!isRoute && pathname === href
          const resolvedHref = isRoute ? href : `/${href}`

          return (
            <li key={label} className={kind === 'secondary' ? 'ml-2' : ''}>
              <Link
                href={resolvedHref}
                aria-current={isActive ? 'page' : undefined}
                onClick={isRoute ? undefined : e => handleClick(e, href)}
                className={`block whitespace-nowrap text-[15px] font-semibold tracking-tight transition-colors duration-300 ${styleFor(
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
