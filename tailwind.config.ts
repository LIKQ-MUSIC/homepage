import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#153051',
          50: '#f0f4f8',
          100: '#dce4ed',
          800: '#1a3a5c',
          900: '#0f2340',
          hover: '#132b49',
          active: '#112641',
          light: '#E8EAEE'
        },
        secondary: {
          DEFAULT: '#BEADC4',
          50: '#faf8fb',
          hover: '#ab9cb0',
          active: '#988a9d',
          dark: {
            DEFAULT: '#8f8293'
          },
          light: {
            DEFAULT: '#f9f7f9'
          }
        },
        danger: {
          DEFAULT: '#ba1a1a',
          hover: '#a71717',
          active: '#951515'
        },
        warning: {
          DEFAULT: '#f46f4e',
          hover: '#dc6446',
          active: '#c3593e'
        },
        success: {
          DEFAULT: '#00a991',
          hover: '#009883',
          active: '#008774'
        },
        disabled: {
          DEFAULT: '#E8EAEE',
          text: '#B6BFC9'
        },
        ink: {
          // "after dark" home surfaces — deeper than primary so #153051 reads as elevation
          deep: '#0A1422',
          raise: '#10213A',
          panel: '#153051',
          text: '#F4F2F6',
          muted: '#ABB6C6',
          line: 'rgba(190, 173, 196, 0.16)'
        },
        // LIKQ 2026 brand world (LIKQ_AD-1.pdf). Navy = The Foundation,
        // Lavender = The Glow of Light. Contrast, measured against white:
        // navy 7.3:1 (body-safe) · lavender 3.0:1 (large display + fields only)
        // · ink 13.6:1 · obsidian 11.9:1. Ink is the text colour on lavender
        // fields (4.5:1); navy on lavender is 2.4:1 and fails everywhere.
        likq: {
          navy: '#2242DA',
          'navy-deep': '#1A34B4',
          lavender: '#C075E4',
          'lavender-pale': '#F2E9FB',
          ink: '#10069F',
          obsidian: '#3B353C',
          paper: '#FAF8FF',
          // beam stops, source to landing
          beam1: '#10069F',
          beam2: '#2242DA',
          beam3: '#5766E0',
          beam4: '#9B6BE8',
          beam5: '#C075E4',
          beam6: '#E0C4F2'
        },
        // Genre & mood mapping — the label's own taxonomy, used to colour
        // work and artists by what the music is, never as decoration.
        genre: {
          gold: '#F7C46B',
          mint: '#D9EBE7',
          rose: '#F8CACA',
          obsidian: '#3B353C'
        },
        y2k: {
          cobalt: '#3B1EFF',
          pink: '#FF3AA5',
          'pink-soft': '#FFB8DB',
          mint: '#2DE8C3',
          yellow: '#FFE14C',
          cream: '#FFF6E6',
          ink: '#0D0A2C'
        }
      },
      fontSize: {
        h3: [
          '18px',
          {
            fontWeight: 700,
            lineHeight: '24px'
          }
        ]
      },
      fontFamily: {
        sans: ['var(--font-noto-sans-thai)', 'var(--font-inter)', 'sans-serif'],
        // Brand world: Thai in LINE Seed, Latin display in Nunito.
        seed: ['var(--font-line-seed)', 'Noto Sans Thai', 'sans-serif'],
        nunito: [
          'var(--font-nunito)',
          'var(--font-line-seed)',
          'system-ui',
          'sans-serif'
        ],
        prompt: ['var(--font-prompt)'],
        pixel: ['"Press Start 2P"', 'ui-monospace', 'monospace'],
        'pixel-mono': ['"VT323"', 'ui-monospace', 'monospace']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        y2kBlink: {
          '0%, 60%': { opacity: '1' },
          '61%, 100%': { opacity: '0' }
        },
        y2kBob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        },
        y2kMarquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        riseIn: {
          '0%': { transform: 'translateY(28px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        // The one authored moment: the beam ignites and the Q opens.
        apertureOpen: {
          '0%': { clipPath: 'circle(0% at 50% 50%)', opacity: '0' },
          '100%': { clipPath: 'circle(50% at 50% 50%)', opacity: '1' }
        },
        ignite: {
          '0%': { opacity: '0', transform: 'scale(1.35)', filter: 'blur(28px)' },
          '100%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0px)' }
        },
        glint: {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.7)' },
          '50%': { opacity: '0.9', transform: 'scale(1)' }
        }
      },
      animation: {
        'aperture-open': 'apertureOpen 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        ignite: 'ignite 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        glint: 'glint 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'rise-in': 'riseIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'label-marquee': 'y2kMarquee 32s linear infinite',
        'y2k-blink': 'y2kBlink 1s steps(2, end) infinite',
        'y2k-bob': 'y2kBob 1.6s ease-in-out infinite',
        'y2k-marquee': 'y2kMarquee 18s linear infinite'
      }
    }
  },
  plugins: []
} satisfies Config
