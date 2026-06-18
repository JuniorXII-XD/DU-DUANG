/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'void':     '#05050A',
        'deep':     '#0B0C1A',
        'veil':     '#131126',
        'border':   '#2A2D52',
        'gold':     '#FFD700',
        'gold-dim': '#B8860B',
        'mystic':   '#9D00FF',
        'mystic-light': '#D280FF',
        'silver':   '#A0AABF',
        'parchment':'#FDF5E6',
        'cyan-neon': '#00F0FF',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body:    ['Inter', 'sans-serif'],
      },
      keyframes: {
        scan: {
          '0%':   { top: '0%' },
          '100%': { top: '100%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.3)' },
        }
      },
      animation: {
        scan: 'scan 2.5s linear infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
