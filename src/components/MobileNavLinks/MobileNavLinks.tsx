import Link from 'next/link'
import React from 'react'

interface NavLink {
  href: string
  label: string
}

interface MobileNavLinksProps {
  onLinkClick: () => void
  dark?: boolean
}

const links: NavLink[] = [
  { href: '#make', label: 'บริการ' },
  { href: '#work', label: 'ผลงาน' },
  { href: '#team', label: 'ทีมงาน' },
  { href: '/artists', label: 'ศิลปิน' },
  { href: '/merch', label: 'Store' },
  { href: '/capybara', label: 'ควิซ' },
  { href: '/partner', label: 'ฝากขาย' },
  { href: '/audition', label: 'Audition' }
]

const MobileNavLinks: React.FC<MobileNavLinksProps> = ({ onLinkClick, dark = false }) => {
  const goToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    const section = document.querySelector(href)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
      history.pushState(null, '', href)
    }
  }

  return (
    <>
      {links.map(link => {
        const isRoute = link.href.startsWith('/')
        const linkClass = dark
          ? `${isRoute ? 'font-bold text-likq-beam6 bg-white/[0.06]' : 'text-white'} hover:bg-white/10`
          : `hover:bg-gray-50 ${isRoute ? 'font-bold text-likq-ink bg-likq-navy/5' : ''}`
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`copy-th block px-8 py-3 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-current ${linkClass}`}
            onClick={
              isRoute
                ? () => onLinkClick()
                : e => {
                    goToSection(e, link.href)
                    onLinkClick()
                  }
            }
          >
            {link.label}
          </Link>
        )
      })}
    </>
  )
}

export default MobileNavLinks
