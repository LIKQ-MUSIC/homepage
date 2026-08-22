import localFont from 'next/font/local'

/**
 * LINE Seed Sans TH — the Thai voice of the LIKQ brand world.
 * Not available on Google Fonts; shipped as self-hosted subset WOFF2 (~28-32KB
 * each), the same five files the @likq-music/store storefront uses, so both
 * public LIKQ surfaces render Thai identically.
 *
 * Lightest weight here is Thin 300. Nunito reaches 200. On a mixed Thai/Latin
 * line, set Nunito to 300 so the two faces match; reserve Nunito 200 for
 * Latin-only lockups.
 */
export const lineSeed = localFont({
  src: [
    { path: './LINESeedSansTH_W_Th.woff2', weight: '300', style: 'normal' },
    { path: './LINESeedSansTH_W_Rg.woff2', weight: '400', style: 'normal' },
    { path: './LINESeedSansTH_W_Bd.woff2', weight: '700', style: 'normal' },
    { path: './LINESeedSansTH_W_XBd.woff2', weight: '800', style: 'normal' },
    { path: './LINESeedSansTH_W_He.woff2', weight: '900', style: 'normal' }
  ],
  variable: '--font-line-seed',
  display: 'swap',
  fallback: ['Noto Sans Thai', 'system-ui', 'sans-serif']
})
