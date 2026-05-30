'use client'

import React, { useState, useEffect } from 'react'
import Hamburger from '@/ui/Icons/Hamburger'
import Close from '@/ui/Icons/Close'
import Youtube from '@/ui/Icons/YouTube'
import Mailbox from '@/ui/Icons/Mailbox'
import NavbarLinks from '../NavbarLinks/NavbarLinks'
import Logo from '@/ui/Icons/Logo'
import MobileNavLinks from '@/components/MobileNavLinks/MobileNavLinks'
import SoundCloud from '@/ui/Icons/SoundCloud'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileNav, setIsMobileNav] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Track screen size for mobile nav visibility (matching lg breakpoint)
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024
      setIsMobileNav(isMobile)
      if (!isMobile) {
        setIsMenuOpen(false)
      }
    }

    // Initial check
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle scroll for sticky navbar (throttled to avoid main-thread blocking)
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        // On the home page, flip to the solid bar once past the services
        // section. On pages without #services (e.g. /partner), fall back to a
        // simple scroll threshold so the bar still turns solid — otherwise the
        // white links sit invisibly over white content below the hero.
        const servicesSection = document.getElementById('services')
        const threshold = servicesSection
          ? servicesSection.offsetTop - 100
          : 80
        setIsScrolled(window.scrollY > threshold)
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navIconColor = isScrolled ? '#153051' : 'white'

  const outerNavLinks = (
    <>
      <Youtube className="youtube-icon" href="https://youtube.com/@likqmusic" />

      <a
        href="https://soundcloud.com/prod-lightz"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 p-2 transition-all rounded-full flex-all-center bg-white text-primary hover:bg-primary-hover hover:text-white"
      >
        <SoundCloud />
      </a>

      <Mailbox href="mailto:contact@likqmusic.com" className="mailbox-icon" />
    </>
  )

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      {/* Contrast scrim: darkens behind the bar over light hero images so
          white nav text stays legible (only in the transparent state). */}
      {!isScrolled && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 via-black/15 to-transparent"
        />
      )}
      <nav className="relative z-10 w-full max-w-7xl px-4 mx-auto lg:px-8">
        <div className="flex flex-nowrap items-center gap-3 px-[18px]">
          {/* Logo stays left; mr-auto pushes the nav cluster to the right. */}
          <a href="#" className="shrink-0 mr-auto hidden lg:block cursor-pointer py-1.5">
            <Logo className="h-90 w-28" fill={navIconColor} />
          </a>

          <a href="#" className="shrink-0 mr-auto lg:hidden cursor-pointer py-1.5">
            {/* Mobile Logo */}
            <Logo className="h-90 w-28" fill={navIconColor} />
          </a>

          {/* Right cluster: nav links · divider · socials, grouped with an
              even rhythm so spacing reads intentionally (not spread apart). */}
          <div className="hidden lg:flex items-center gap-5">
            <NavbarLinks isScrolled={isScrolled} />
            {/* Socials show only at xl so the lg→xl range never overflows. */}
            <span
              aria-hidden
              className={`hidden xl:block h-5 w-px ${
                isScrolled ? 'bg-primary/20' : 'bg-white/30'
              }`}
            />
            <div className="hidden xl:flex items-center gap-3">
              {outerNavLinks}
            </div>
          </div>

          <button
            onClick={toggleMenu}
            className="relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] select-none rounded-lg text-center align-middle text-xs font-medium uppercase text-inherit transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
              {isMenuOpen ? <Close fill={navIconColor} /> : <Hamburger fill={navIconColor} />}
            </span>
          </button>

          {/* Mobile Menu */}
          {isMenuOpen && isMobileNav && (
            <div className="absolute rounded-xl top-16 right-0 bg-white w-64 z-50 shadow-lg lg:hidden">
              <nav className="flex flex-col py-4">
                <MobileNavLinks onLinkClick={() => setIsMenuOpen(false)} />

                <div className="flex-all-center gap-8">{outerNavLinks}</div>
              </nav>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
