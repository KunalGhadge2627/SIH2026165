/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oil: {
          navy: '#002B49',
          'navy-dark': '#001D33',
          'navy-light': '#00406C',
          blue: '#0A4B7C',
          gold: '#DAA520',
          'gold-light': '#F3E5AB',
          yellow: '#E6A100',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0'
        },
        risk: {
          critical: '#DC2626',
          'critical-bg': '#FEF2F2',
          high: '#EA580C',
          'high-bg': '#FFF7ED',
          medium: '#D97706',
          'medium-bg': '#FEFCE8',
          low: '#16A34A',
          'low-bg': '#F0FDF4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Noto Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
