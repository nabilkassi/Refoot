import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: '#00C853',
          dark: '#00A040',
        },
        black: '#0A0A0A',
        surface: '#111214',
        surface2: '#181A1C',
        'badge-used': '#F59E0B',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      borderColor: {
        subtle: 'rgba(255,255,255,0.07)',
      },
    },
  },
  plugins: [],
}
export default config
