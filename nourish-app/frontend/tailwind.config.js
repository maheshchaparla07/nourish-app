/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Muted Sage Green (Calm, Trust, Care)
        'nourish': {
          50: '#F5F7F6',
          100: '#E8EDEA',
          200: '#D1DBD5',
          300: '#A8B9AE',
          400: '#7A9487',
          500: '#5A7A6A', // Main primary - muted sage
          600: '#4A6658',
          700: '#3D5247',
          800: '#2F3F36',
          900: '#1F2A24',
        },
        // Secondary - Soft Dusty Blue (Peace, Serenity)
        'nourish-blue': {
          50: '#F4F6F8',
          100: '#E3E8ED',
          200: '#C7D1DB',
          300: '#9FB0C0',
          400: '#6F8AA0',
          500: '#5A7288', // Main secondary - muted blue
          600: '#4A5D70',
          700: '#3D4D5C',
          800: '#2F3C48',
          900: '#1F2830',
        },
        // Accent - Warm Beige (Comfort, Warmth)
        'nourish-beige': {
          50: '#FAF9F7',
          100: '#F3F1ED',
          200: '#E6E2DB',
          300: '#D4CDC0',
          400: '#BEB5A3',
          500: '#A89B86', // Main accent - warm beige
          600: '#8B7F6D',
          700: '#6F6557',
          800: '#534C42',
          900: '#36322C',
        },
        // Neutral - Soft Grays
        'nourish-gray': {
          50: '#FAFAF9',
          100: '#F5F4F2',
          200: '#E8E6E3',
          300: '#D6D3CE',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

