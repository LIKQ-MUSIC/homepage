import React from 'react'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'warning'
  | 'success'
  | 'outline'
  // Light pill for dark / photographic backgrounds (hero, audition, footer)
  | 'onDark'
  // Transparent pill on dark backgrounds that fills white on hover (about-us)
  | 'onDarkOutline'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /**
   * When set the button renders as a link instead of a `<button>`:
   * internal paths (starting with `/`) use next/link; everything else
   * (hash, mailto, external) renders a plain `<a>`. All the crafted motion
   * (ripple, sheen, lift) is preserved either way.
   */
  href?: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
  prefetch?: boolean
  // className, onClick, disabled, children are inherited from React.ButtonHTMLAttributes
}
