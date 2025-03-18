/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md-lg': { 'min': '950px', 'max': '1410px' },
        'tb': { 'raw': '(max-width: 949px)' },
        'ml': { 'raw': '(max-width: 450px)' },
        'ms': { 'raw': '(max-width: 420px)' },
        'mm': { 'raw': '(max-width: 350px)' },
      }
    },
  },
  plugins: [],
}

