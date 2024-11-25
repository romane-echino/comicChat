/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors:{
          comic:'#92C8F8'
        }
      }
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }