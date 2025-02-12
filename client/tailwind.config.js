/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#03C988',
        'primary-hover': '#029966',
        'primary-txt': '#333333',
        'secondary-txt': '#c0c1bf',
        'primary-bg': '#f9f9f9',
        'primary-btn': '#333333',
        'primary-btn-hover': '#4d4d4d',
        'link': '#0077b5',
        // Adding dashboard-specific colors
        'dashboard': {
          'sidebar': {
            'active': '#03C988',    // Using your primary color
            'hover': '#ebfef9',     // Light version of primary
            'text': '#333333',      // Using your primary-txt
            'icon': '#6b7280',      // Gray-500
          }
        }
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      gradientColorStops: theme => ({
        'primary': {
          'light': '#03C988',      // Your primary color
          'dark': '#02a06d',       // Darker shade of primary
        }
      }),
      boxShadow: {
        'sidebar': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 4px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}