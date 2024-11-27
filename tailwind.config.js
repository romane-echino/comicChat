/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'col-span-4',
    'col-span-5',
    'col-span-6',
    'col-span-7',
    'col-span-8',
  ],
  theme: {
    extend: {
      colors: {
        comic: '#92C8F8'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}