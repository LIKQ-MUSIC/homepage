import { Archivo, Inter, Noto_Sans_Thai, Prompt } from 'next/font/google'

export const archivo = Archivo({
  weight: 'variable',
  subsets: ['latin'],
  variable: '--font-archivo',
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
