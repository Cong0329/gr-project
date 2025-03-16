/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md-lg': { 'min': '768px', 'max': '1410px' },
        'tb': { 'raw': '(max-width: 768px)' },
        'ml': { 'raw': '(max-width: 450px)' },
      }
    },
  },
  plugins: [],
}

