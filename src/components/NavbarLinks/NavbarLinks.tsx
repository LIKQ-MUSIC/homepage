import React from 'react'
import { Title } from '@/ui/Typography'

const NavbarLinks = ({ isScrolled }: { isScrolled?: boolean }) => {
  const links = [
    { href: '#services', label: 'Our Services' },
    { href: '#work', label: 'Our Work' },
    { href: '#team', label: 'Our Team' },
    { href: '/partner', label: 'ฝากขาย', isRoute: true },
    { href: '/audition', label: 'Audition', isRoute: true }
  ]

  const handleClick = (
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
    <div className="hidden lg:block">
      <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        {links.map(({ href, label, isRoute }) => (
          <li key={label} className="flex items-center px-8 py-4">
            <a
              href={href}
              onClick={isRoute ? undefined : e => handleClick(e, href)}
              className="flex items-center"
            >
              <Title
                level={6}
                className={`hover:text-primary transition-colors duration-300 ${
                  isRoute
                    ? isScrolled
                      ? 'text-white bg-primary px-4 py-1.5 rounded-full hover:bg-primary-hover hover:!text-white'
                      : 'text-primary bg-white px-4 py-1.5 rounded-full hover:bg-primary hover:!text-white'
                    : isScrolled
                      ? 'text-primary'
                      : 'text-white'
                }`}
              >
                {label}
              </Title>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NavbarLinks
