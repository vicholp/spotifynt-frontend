/** @type {import('tailwindcss').Config} */
import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:{
          100: '#FCE7F3',
          200: '#F8C2E2',
          500: '#E2279E',
          800: '#9F1853',
        },
        secondary: {

        },
      },
    },
  },
  plugins: [
    formsPlugin,
    typographyPlugin,
  ],
};

