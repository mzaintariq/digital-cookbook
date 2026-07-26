import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-primary': {
          DEFAULT: '#19907F',
          50: '#E7F6F3',
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

        /**
         * Editorial ink (text)
         */
        'ink': {
          DEFAULT: '#111312',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1F2937',
          900: '#111312',
          950: '#0B1220',
        },

        /**
         * Warm paper (backgrounds / borders / subtle fills)
         */
        'paper': {
          DEFAULT: '#FAFAF7',
          0: '#FFFFFF',
          50: '#FAFAF7',
          100: '#F4F4EF',
          200: '#EFEFE9',
          300: '#E4E4DC',
          400: '#D6D6CC',
          500: '#B9B9AE',
          600: '#8D8D84',
          700: '#5F5F59',
          800: '#3A3A37',
          900: '#1F201E',
          950: '#111312',
        },

        // semantic colors
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
        },
      },
    },
  },
}
