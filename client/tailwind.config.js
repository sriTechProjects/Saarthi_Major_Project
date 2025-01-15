/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary': '#03C988',
        'primary-txt': '#333333',
        'secondary-txt': '#c0c1bf',
        'primary-bg' : '#f9f9f9',
        'primary-btn': '#333333',
        'primary-btn-hover': '#4d4d4d',
        'link': '#0077b5',
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
    },
  },
  plugins: [],
}