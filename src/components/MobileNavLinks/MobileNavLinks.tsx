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
  { href: '#services', label: 'Our Services' },
  { href: '#work', label: 'Our Work' },
  { href: '#team', label: 'Our Team' },
  { href: '/artists', label: 'ศิลปิน' },
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
          ? `${isRoute ? 'font-bold text-secondary bg-secondary/[0.08]' : 'text-ink-text'} hover:bg-white/5`
          : `hover:bg-gray-50 ${isRoute ? 'font-bold text-primary bg-primary/5' : ''}`
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-8 py-3 text-center block transition-colors ${linkClass}`}
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
