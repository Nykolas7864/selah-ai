import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm devotional palette
        parchment: {
          50: '#fdfbf7',
          100: '#f9f3e8',
          200: '#f0e4cb',
          300: '#e5d0a8',
          400: '#d4b577',
          500: '#c49a4e',
        },
        olive: {
          50: '#f6f7f0',
          100: '#e8ebd6',
          200: '#d1d7af',
          300: '#b3be80',
          400: '#95a357',
          500: '#78873e',
          600: '#5e6b30',
          700: '#485228',
          800: '#3b4323',
          900: '#333a20',
        },
        wine: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ec7896',
          500: '#df4d75',
          600: '#c92d5c',
          700: '#a9204b',
          800: '#8e1d42',
          900: '#791c3d',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#c4940a',
          600: '#a37708',
          700: '#7c5b0b',
          800: '#674a10',
          900: '#573e13',
        },
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
