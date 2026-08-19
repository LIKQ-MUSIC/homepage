import type { Metadata } from 'next'
import { Mali } from 'next/font/google'
import { Letter } from './Letter'
import './bibi.css'

/**
 * A surprise, living at /bibi.
 *
 * Deliberately its own route rather than an edit to the real homepage: the dev
 * site stays usable for everyone else, the link can be sent on its own, and
 * taking it down later is `rm -rf src/app/bibi` with nothing left behind. Every
 * class it defines is prefixed `bibi-`, and it imports nothing from the rest of
 * the app but the fonts.
 */

/**
 * A warm Thai face, because this is handwriting, not an interface.
 *
 * Mali rather than a decorative script. The first attempt used Charmonman and
 * "รักบิบี๋" came out as "รกบบ" with the vowel and tone marks floating loose
 * above the consonants: many Latin-first script faces ship a Thai subset whose
 * mark positioning falls apart at display size, and this page is one name at
 * display size. Mali is drawn by a Thai foundry and stacks its marks correctly,
 * which matters more here than any amount of flourish.
 *
 * `next/font/google` self-hosts it at build time, so there is no request to
 * Google when the page opens and no flash of the wrong letterforms in front of
 * the person it was made for.
 */
const script = Mali({
  weight: ['400', '600'],
  subsets: ['thai', 'latin'],
  variable: '--font-bibi-script',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'รักบิบี๋',
  // Nobody should find this by searching, and no crawler should hold on to it
  // after the folder is deleted.
  robots: { index: false, follow: false }
}

export default function BibiPage() {
  return (
    <div className={script.variable}>
      <Letter />
    </div>
  )
}
