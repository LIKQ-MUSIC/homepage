'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Title } from '@/ui/Typography'

const links = [
  { href: '#services', label: 'Our Services' },
  { href: '#work', label: 'Our Work' },
  { href: '#team', label: 'Our Team' },
  { href: '/partner', label: 'ฝากขาย', isRoute: true },
  { href: '/audition', label: 'Audition', isRoute: true }
]

const NavbarLinks = ({ isScrolled }: { isScrolled?: boolean }) => {
  const pathname = usePathname()

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // On non-home pages, let the browser follow the anchor to "/#section".
    if (pathname !== '/') return
    e.preventDefault()
    const section = document.querySelector(href)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      history.pushState(null, '', href)
    }
  }

  return (
    <div className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {links.map(({ href, label, isRoute }) => {
          const isActive = isRoute && pathname === href
          // Anchor links resolve against home so they work from any page.
          const resolvedHref = isRoute ? href : `/${href}`

          const pill = isScrolled
            ? 'bg-primary text-white hover:bg-primary-hover'
            : 'bg-white text-primary hover:bg-primary hover:!text-white'

          const plain = isScrolled
            ? 'text-primary hover:bg-primary/5'
            : 'text-white hover:bg-white/15 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]'

          return (
            <li key={label}>
              <Link
                href={resolvedHref}
                aria-current={isActive ? 'page' : undefined}
                onClick={isRoute ? undefined : e => handleClick(e, href)}
                className={`block whitespace-nowrap rounded-full px-4 py-2 transition-colors duration-300 ${
                  isRoute ? pill : plain
                } ${isActive ? 'ring-2 ring-secondary' : ''}`}
              >
                <Title level={6} className="!text-inherit">
                  {label}
                </Title>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default NavbarLinks
