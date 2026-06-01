import React from 'react'
import { ParagraphProps, ParagraphVariant } from '@/ui/Typography/Paragraph/types'
import { cn } from '@/utils'

const variantClasses: Record<ParagraphVariant, string> = {
  default: '',
  // Eyebrow label. text-primary/70 clears AA on the light page bg where the old
  // gray-400 sat near 2.6:1; dark sections override the colour via Section.
  label: 'text-sm font-medium tracking-[0.3em] uppercase text-primary/70'
}

const Paragraph = ({ variant = 'default', className, children }: ParagraphProps) => (
  <p className={cn([variantClasses[variant], className])}>{children}</p>
)

export default Paragraph
