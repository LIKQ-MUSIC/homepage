import type { Metadata } from 'next'
import './globals.css'
import { inter, notoSans, nunito, prompt } from '@/utils/font'
import { lineSeed } from '@/fonts/lineSeed'
import ReactQueryProvider from '@/provider/ReactQueryProvider'
import { ThemeProvider } from '@/provider/ThemeProvider'

const DIRECTION_CONTRACT = `<!--
impeccable direction contract · likq-2026-beam

THESIS: The page is one continuous beam of light that splits at a prism into
two audience paths. It refuses the stacked-section scroll of equal-weight
blocks with eyebrow headers, hairline rules and a marquee.

OWN-WORLD: Bright navy #2242DA and lavender #C075E4 over a ground that travels
from Pantone 072 #10069F to white. Grain, bloom, drawn glints. Nunito
ExtraLight for Latin over LINE Seed Sans TH for Thai. Stations, not cards;
panels, not borders.

STORY: LIKQ makes music and makes artists. The visitor picks a side at the
prism, then follows one lane: to start a project, or to watch, buy and apply.

FIRST VIEWPORT: Deep navy field, LikQ wordmark centred in Nunito 200,
"Igniting the Quality" beneath, and the label's own footage alive inside the
Q's counter as a circular aperture that opens on load.

FORM: continuous light field · candidate 7 of 7 · seed f4953978

FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, and DESIGN.md
-->`

export const metadata: Metadata = {
  metadataBase: new URL('https://www.likqmusic.com'),
  title: {
    default: 'LiKQ MUSIC | Production & Entertainment Services',
    template: '%s | LiKQ MUSIC'
  },
  description:
    'LiKQ MUSIC บริการด้านเสียงเพลงและความบันเทิง ครอบคลุมการสร้างสรรค์ ดนตรี การทำเพลง และการผลิตเนื้อหาเสียงคุณภาพสูง พร้อมทีมงานมืออาชีพ',
  keywords: [
    'LiKQ MUSIC',
    'Music Production',
    'Entertainment',
    'Songwriting',
    'Mixing',
    'Mastering',
    'Vocal Tuning',
    'Thailnd Music',
    'แต่งเพลง',
    'ทำเพลง',
    'มิกซ์เสียง',
    'มาสเตอร์ริ่ง'
  ],
  authors: [{ name: 'LiKQ MUSIC Team' }],
  creator: 'LiKQ MUSIC',
  publisher: 'LiKQ MUSIC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    title: 'LiKQ MUSIC | Production & Entertainment Services',
    description:
      'LiKQ MUSIC บริการด้านเสียงเพลงและความบันเทิง ครอบคลุมการสร้างสรรค์ ดนตรี การทำเพลง และการผลิตเนื้อหาเสียงคุณภาพสูง',
    url: 'https://www.likqmusic.com',
    siteName: 'LiKQ MUSIC',
    locale: 'th_TH',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Ensure this image exists or is added later
        width: 1200,
        height: 630,
        alt: 'LiKQ MUSIC Production'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LiKQ MUSIC',
    description:
      'LiKQ MUSIC บริการด้านเสียงเพลงและความบันเทิง ครอบคลุมการสร้างสรรค์ ดนตรี การทำเพลง และการผลิตเนื้อหาเสียงคุณภาพสูง',
    images: ['/twitter-image.jpg'] // Ensure this image exists or is added later
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body
        className={`${inter.variable} ${notoSans.variable} ${prompt.variable} ${nunito.variable} ${lineSeed.variable} antialiased bg-page text-body`}
      >
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <ReactQueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
