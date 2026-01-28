import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        'brand-primary': {
          DEFAULT: '#19907F',
          50:  '#E7F6F3',
          100: '#D3EFE9',
          200: '#A7DFD4',
          300: '#7BCFBE',
          400: '#47B7A3',
          500: '#19907F',
          600: '#147A6B',
          700: '#116457',
          800: '#0E5047',
          900: '#0B3F38',
          950: '#062520',
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

