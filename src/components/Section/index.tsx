import React from 'react'
import { ISectionProps } from '@/components/Section/types'
import { Title, Paragraph } from '@/ui/Typography'

import { cn } from '@/utils'

const Section = ({ id, label, title, dark, children, className }: ISectionProps) => {
  return (
    <section
      id={id}
      className={cn([
        'min-h-fit py-16 md:py-24 flex flex-col items-center justify-start px-4 md:px-8',
        className
      ])}
    >
      {label && (
        <Paragraph variant="label" className={cn(['mb-4', dark && 'text-white/70'])}>
          {label}
        </Paragraph>
      )}

      {title && (
        <Title className={cn(['text-center', dark && '!text-white'])} level={2}>
          {title}
        </Title>
      )}

      {children}
    </section>
  )
}

export default Section
