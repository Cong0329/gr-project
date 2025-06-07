/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Widths
    'w-full', 'w-40', 'w-36', 'w-32', 'w-28', 'w-24', 'w-20', 'w-16', 'w-12', 'w-8', 'w-5', 'w-3/4',

    // Liệt kê cụ thể các class với giá trị tùy chỉnh (arbitrary values)
    'w-[500px]', 'w-[300px]', 'ml:h-[325px]',

    // Heights
    'h-16', 'h-10', 'h-8', 'h-7', 'h-6', 'h-5', 'h-2',
    'tb:h-32 mm:h-[100px] mm:w-[230px] ms:h-[100px] ms:w-[270px]',
    'p-4', 'ms:p-0',

    'flex', 'justify-center', 'items-center',

    'hidden', 'block',

    // Backgrounds & text
    'bg-white', 'bg-gray-200', 'text-black', 'text-gray-300', 'text-gray-500', 'text-gray-600',

    // Borders
    'border', 'border-t', 'border-b', 'border-r', 'border-gray-300',

    'object-contain',
 

    // Rounded
    'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-full',

    // Flex & grid layouts
    'flex', 'grid', 'items-center', 'justify-between', 'justify-end',
    'gap-x-2', 'gap-1', 'gap-2', 'gap-4', 'space-x-2', 'space-x-4',

    // Responsive widths & hidden
    'ml:hidden', 'md-lg:w-52', 'ms:w-44', 'mm:w-32', 'md:w-[300px]', 'tb:w-[300px]',

    // Padding & margin
    'p-2', 'p-4', 'pt-4', 'pb-2', 'mt-2', 'mt-4', 'mt-7', 'mb-2', 'mr-2', 'ml-1', 'ml-4',

    // Animation
    'animate-pulse',
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
  plugins: [require("tailwind-scrollbar-hide")],
}

