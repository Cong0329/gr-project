/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md-lg': { 'min': '768px', 'max': '1410px' }, // Chỉ từ 768px đến 1024px
        'tb': { 'min': '320px', 'max': '768px' },
      }
    },
  },
  plugins: [],
}

