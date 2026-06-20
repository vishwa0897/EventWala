/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        wala: {
          dark: '#0F172A',   
          primary: '#2563EB', 
          light: '#EFF6FF',   
          white: '#FFFFFF',   
        }
      }
   },
  },
  plugins: [],
}