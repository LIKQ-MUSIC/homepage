import { Inter, Noto_Sans_Thai, Nunito, Prompt } from 'next/font/google'

/**
 * Nunito — the Latin display voice of the LIKQ brand world (LIKQ_AD-1.pdf).
 * Variable 200-1000: 200 for Latin-only lockups, 300 upward everywhere Thai
 * sits on the same line as Latin. Pairs with LINE Seed Sans TH.
 */
export const nunito = Nunito({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap'
})

export const inter = Inter({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--font-inter'
})

export const notoSans = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '700'], // or ["100", "300", "400", "500", "700", "900"]
  display: 'swap',
  variable: '--font-noto-sans-thai'
})

export const prompt = Prompt({
  weight: ['400', '700'],
  subsets: ['thai', 'latin'],
  variable: '--font-prompt',
  display: 'swap'
})
