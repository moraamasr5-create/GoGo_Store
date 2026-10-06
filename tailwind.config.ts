import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FAF8F5',
          100: '#F4EFEA',
          200: '#E8DFD5',
          300: '#D6C7B6',
          400: '#BDAB94',
          500: '#A38F75',
          600: '#8A775F',
        },
        stone: {
          50: '#F9F9F8',
          100: '#F2F2F0',
          200: '#E4E3DF',
          300: '#D1CFCA',
          400: '#A8A59E',
          500: '#7E7A71',
          600: '#5F5C55',
          700: '#3E3C38',
          800: '#2A2926',
          900: '#1D1C19',
          950: '#141311',
        },
        brass: {
          100: '#FBF3E2',
          200: '#F6E4BF',
          300: '#ECC87A',
          400: '#DFB15B',
          500: '#C89736',
          600: '#A97C23',
          700: '#8A6218',
          800: '#6C4C10',
          900: '#4E360B',
        },
        surface: {
          canvas: 'var(--bg-canvas)',
          card: 'var(--surface-card)',
          subtle: 'var(--surface-subtle)',
          elevated: 'var(--surface-elevated)',
        },
        charcoal: '#18181B',
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'Cairo', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

