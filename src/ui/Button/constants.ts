import { ButtonSize, ButtonVariant } from './types'

export const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-active dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800',
  secondary:
    'bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-active dark:bg-neutral-700 dark:hover:bg-neutral-600',
  ghost:
    'bg-transparent text-primary hover:shadow-none active:bg-primary-light dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20',
  danger: 'bg-danger text-white hover:bg-danger-hover active:bg-danger-active',
  warning:
    'bg-warning text-white hover:bg-warning-hover active:bg-warning-active',
  success:
    'bg-success text-white hover:bg-success-hover active:bg-success-active',
  outline:
    'border border-primary text-primary hover:bg-primary-light dark:border-[#334155] dark:text-neutral-300 dark:hover:bg-white/10',
  onDark:
    'bg-white text-likq-ink hover:bg-likq-lavender-pale focus-visible:ring-white/70',
  onDarkOutline:
    'bg-transparent text-white border border-white/40 hover:bg-white hover:text-primary focus-visible:ring-white/70'
}

// Tint of the diagonal highlight that sweeps across on hover. Light against
// dark fills, navy against light fills, so the sheen reads on every surface.
export const sheenClasses: Record<ButtonVariant, string> = {
  primary: 'via-white/25',
  secondary: 'via-white/30',
  ghost: 'via-primary/10',
  danger: 'via-white/25',
  warning: 'via-white/25',
  success: 'via-white/25',
  outline: 'via-primary/10',
  onDark: 'via-primary/15',
  onDarkOutline: 'via-white/25'
}

// Hover shadow + coloured glow so the lift feels lit, not just shadowed.
// ghost stays flat (keeps its own hover:shadow-none) so it reads as quiet.
export const glowClasses: Record<ButtonVariant, string> = {
  primary: 'hover:shadow-lg hover:shadow-primary/30',
  secondary: 'hover:shadow-lg hover:shadow-secondary/40',
  ghost: '',
  danger: 'hover:shadow-lg hover:shadow-danger/30',
  warning: 'hover:shadow-lg hover:shadow-warning/30',
  success: 'hover:shadow-lg hover:shadow-success/30',
  outline: 'hover:shadow-lg hover:shadow-primary/20',
  onDark: 'hover:shadow-lg hover:shadow-black/25',
  onDarkOutline: 'hover:shadow-lg hover:shadow-black/20'
}

export const buttonSizesClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-sm rounded-[20px]',
  md: 'h-9 px-4 text-base rounded-[24px]',
  lg: 'h-12 px-6 text-lg rounded-[28px]'
}
