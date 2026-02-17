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
    'border border-primary text-primary hover:bg-primary-light dark:border-[#334155] dark:text-neutral-300 dark:hover:bg-white/10'
}

export const buttonSizesClass: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-sm rounded-[20px]',
  md: 'h-9 px-4 text-base rounded-[24px]',
  lg: 'h-12 px-6 text-lg rounded-[28px]'
}
