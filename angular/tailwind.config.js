/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
        '4xl': '1em 2em 2em rgba(0, 0, 0, 0.25)'
      }
    },
  },
  plugins: [],
}

