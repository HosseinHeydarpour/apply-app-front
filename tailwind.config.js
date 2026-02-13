/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'color-bg': '#efede6',
        'color-dark': '#1d1a15',
        'color-gray': '#a4a6b4',
        'color-orange': '#fe8f72',
        'color-bright': '#b6b6b4',
        'color-gold': '#d7bb7b',
      },
      fontFamily: {
        sans: ['IRANSans', 'sans-serif'], // Sets it as default
      },
      screens: {
        xs: '450px',
      },
    },
  },
  plugins: [],
};
