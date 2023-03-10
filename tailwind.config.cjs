/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins'],
        'body': ['Poppins', 'sans-serif'],
        'title': ['Montserrat', 'sans-serif']
      },
      spacing: {
        '50': "50%"
      }
    },
  },
  plugins: [],
}