import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9c702a',
          50: '#faf8f4',
          100: '#f5f0e8',
          200: '#eae0d1',
          300: '#d9c5a8',
          400: '#c4a578',
          500: '#9c702a',
          600: '#8a6125',
          700: '#724d20',
          800: '#5e401d',
          900: '#4f361b',
          950: '#2a1c0e',
        },
        // Alias for primary-color naming convention
        'brand-primary': {
          DEFAULT: '#9c702a',
          50: '#faf8f4',
          100: '#f5f0e8',
          200: '#eae0d1',
          300: '#d9c5a8',
          400: '#c4a578',
          500: '#9c702a',
          600: '#8a6125',
          700: '#724d20',
          800: '#5e401d',
          900: '#4f361b',
          950: '#2a1c0e',
        },
        'text-dark': {
          DEFAULT: '#1b2629',
          50: '#f4f6f7',
          100: '#e3e8ea',
          200: '#c8d2d6',
          300: '#a1b2b9',
          400: '#738a94',
          500: '#576e79',
          600: '#485a63',
          700: '#3d4b53',
          800: '#364147',
          900: '#1b2629',
          950: '#0f1619',
        },
        'white-smoke': {
          DEFAULT: '#f9f7f3',
          50: '#fefdfb',
          100: '#fdfbf7',
          200: '#faf8f0',
          300: '#f6f3e6',
          400: '#f0ead6',
          500: '#f9f7f3',
          600: '#e8e4d8',
          700: '#d1c9b5',
          800: '#b5a98f',
          900: '#9a8d6f',
          950: '#7d6f4f',
        },
      },
    },
  },
}

