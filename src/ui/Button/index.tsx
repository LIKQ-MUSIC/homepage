import React, { forwardRef } from 'react'
import Link from 'next/link'
import { cn } from '@/utils'

import ClientRipple from './Ripple'
import { ButtonProps } from './types'
import {
  buttonSizesClass,
  variantClasses,
  sheenClasses,
  glowClasses
} from './constants'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'lg',
      className,
      children,
      disabled,
      href,
      target,
      rel,
      prefetch,
      ...props
    },
    ref
  ) => {
    const sharedClasses = cn([
      `group relative isolate overflow-hidden font-medium flex items-center justify-center whitespace-nowrap
       transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out
       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-0`,
      buttonSizesClass[size],
      variantClasses[variant],
      // Lift, glow and press feedback only when interactive.
      !disabled &&
        `${glowClasses[variant]} motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98]`,
      className,
      disabled &&
        'bg-disabled text-disabled-text border-transparent cursor-not-allowed shadow-none hover:bg-disabled hover:shadow-none'
    ])

    // Sheen sits at -z-10 inside the button's isolated stacking context, so it
    // paints above the fill but below the label; the ripple layer stays on top
    // and keeps capturing clicks exactly as before.
    const content = (
      <>
        {children}
        {!disabled && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
          >
            <span
              className={cn([
                'absolute inset-y-0 left-0 w-1/3 -translate-x-[160%] skew-x-[-20deg]',
                'bg-gradient-to-r from-transparent to-transparent',
                sheenClasses[variant],
                'transition-transform duration-700 ease-out motion-safe:group-hover:translate-x-[420%]'
              ])}
            />
          </span>
        )}
        <ClientRipple />
      </>
    )

    if (href !== undefined) {
      const isInternal = href.startsWith('/')
      const commonAnchorProps = {
        className: sharedClasses,
        target,
        rel,
        'aria-disabled': disabled || undefined,
        // Button handlers (typed for HTMLButtonElement) are structurally fine
        // on an anchor at runtime; relax the element-specific typing here.
        ...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)
      }

      if (isInternal) {
        return (
          <Link
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            prefetch={prefetch}
            {...commonAnchorProps}
          >
            {content}
          </Link>
        )
      }

      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...commonAnchorProps}>
          {content}
        </a>
      )
    }

    return (
      <button ref={ref} disabled={disabled} className={sharedClasses} {...props}>
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
