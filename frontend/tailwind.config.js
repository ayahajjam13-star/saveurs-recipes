/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cream': '#FDF8F3',
        'warm-brown': '#3D2817',
        'fresh-green': '#4A7C59',
        'orange-accent': '#E07A5F',
        'gold': '#C9A961',
        'dark-bg': '#1A1410',
        'dark-card': '#2A211A',
        'dark-text': '#E8DCC8',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}