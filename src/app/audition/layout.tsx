import type { Metadata } from 'next'

const title = 'ออดิชั่น Idol-Artist | LIKQ MUSIC'
const description =
  'LIKQ MUSIC เปิดออดิชั่น Idol-Artist เก่งหนึ่งด้านก็เริ่มที่นี่ได้ Vocals, Visual, Variety, Dance เราคัดคนที่มีสกิลอย่างน้อยหนึ่งด้าน ที่เหลือเป็นหน้าที่เรา'
const url = '/audition'
const ogImage = {
  url: '/logo.png',
  width: 820,
  height: 258,
  alt: 'LIKQ MUSIC',
}

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'LIKQ MUSIC',
    'ออดิชั่น',
    'Idol',
    'Idol-Artist',
    'audition',
    'วงไอดอล',
    'ค่ายเพลงไทย',
    'สมัครไอดอล',
    'ออดิชั่น Idol ไทย',
  ],
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: 'LIKQ MUSIC',
    locale: 'th_TH',
    type: 'website',
    images: [ogImage],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage.url],
  },
}

export default function AuditionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
