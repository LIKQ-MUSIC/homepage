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
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'y2k-blink': 'y2kBlink 1s steps(2, end) infinite',
        'y2k-bob': 'y2kBob 1.6s ease-in-out infinite',
        'y2k-marquee': 'y2kMarquee 18s linear infinite'
      }
    }
  },
  plugins: []
} satisfies Config
