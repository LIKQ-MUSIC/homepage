import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Idol Audition',
  description:
    'LiKQ Music is looking for new talent. Apply now to join our idol group — show us your voice, your creativity, and your vision.',
  openGraph: {
    title: 'Idol Audition | LiKQ MUSIC',
    description:
      'Apply to join LiKQ Music\'s new idol group. Show us your passion, your voice, and your creative vision.',
    type: 'website',
  },
}

export default function AuditionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
