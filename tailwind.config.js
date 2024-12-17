/** @type {import('tailwindcss').Config} */
import scrollbar from 'tailwind-scrollbar'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        github: {
          canvas: {
            default: 'var(--canvas-default)',
            subtle: 'var(--canvas-subtle)',
            inset: 'var(--canvas-inset)',
            overlay: 'var(--canvas-overlay)',
          },
          border: {
            default: 'var(--border-default)',
            muted: 'var(--border-muted)',
            subtle: 'var(--border-subtle)',
          },
          fg: {
            default: 'var(--fg-default)',
            muted: 'var(--fg-muted)',
            subtle: 'var(--fg-subtle)',
            onEmphasis: 'var(--fg-onEmphasis)',
          },
          btn: {
            bg: 'var(--btn-bg)',
            hover: 'var(--btn-hover)',
            active: 'var(--btn-active)',
            border: 'var(--btn-border)',
          },
          accent: {
            fg: 'var(--accent-fg)',
            emphasis: 'var(--accent-emphasis)',
            muted: 'var(--accent-muted)',
            subtle: 'var(--accent-subtle)',
          },
          success: {
            fg: 'var(--success-fg)',
            emphasis: 'var(--success-emphasis)',
            muted: 'var(--success-muted)',
            subtle: 'var(--success-subtle)',
          },
          attention: {
            fg: 'var(--attention-fg)',
            emphasis: 'var(--attention-emphasis)',
            muted: 'var(--attention-muted)',
            subtle: 'var(--attention-subtle)',
          },
          danger: {
            fg: 'var(--danger-fg)',
            emphasis: 'var(--danger-emphasis)',
            muted: 'var(--danger-muted)',
            subtle: 'var(--danger-subtle)',
          },
        },
        neo: {
          shadow: 'var(--neo-shadow)',
          border: 'var(--neo-border-width)',
        },
        wooden: {
          grain: 'var(--wood-grain)',
          shadow: 'var(--wood-shadow)',
        },
        steel: {
          gradient: 'var(--steel-gradient)',
          highlight: 'var(--steel-highlight)',
        },
        silicone: {
          texture: 'var(--silicone-texture)',
          surface: 'var(--silicone-surface)',
        },
        copper: {
          patina: 'var(--copper-patina)',
        },
        ceramic: {
          glaze: 'var(--ceramic-glaze)',
        },
        marble: {
          veins: 'var(--marble-veins)',
          highlight: 'var(--marble-highlight)',
        },
      },
      backgroundImage: {
        'wood-grain': 'var(--wood-grain)',
        'steel-gradient': 'var(--steel-gradient)',
        'steel-highlight': 'var(--steel-highlight)',
      },
      boxShadow: {
        neo: 'var(--neo-shadow)',
        wooden: 'var(--wood-shadow)',
      },
      keyframes: {
        'slide-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-left': 'slide-left 0.2s ease-out',
        fadeIn: 'fadeIn 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [
    scrollbar({ nocompatible: true }),
    function ({ addComponents }) {
      addComponents({
        '.theme-neo-brutalism': {
          '@apply border-[3px] border-black shadow-neo': {},
        },
        '.theme-wooden': {
          '@apply bg-wood-grain shadow-wooden': {},
        },
        '.theme-steel': {
          '@apply bg-steel-gradient': {},
          '&::after': {
            content: '""',
            '@apply absolute inset-0 bg-steel-highlight pointer-events-none': {},
          },
        },
      })
    },
  ],
  variants: {
    scrollbar: ['rounded', 'dark'],
  },
}
