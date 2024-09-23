/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        lato:"Lato, sans-serif",
        mont:"Montserrat, sans-serif"
      },
      boxShadow:{
        navShadow:"rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        cardShadow:"rgba(0, 0, 0, 0.09) 0px 3px 12px"
      }
    },
  },
  plugins: [],
}