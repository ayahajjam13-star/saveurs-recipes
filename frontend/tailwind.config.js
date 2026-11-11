
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
        // =====================================
        // SAVEURS — GUAVA COLOR PALETTE
        // =====================================

        'guava-green': '#718B68',
        'guava-light': '#A8BA9B',

        'guava-pink': '#DBC29C',
        'guava-soft': '#EADAC2',

        'guava-peach': '#F5D8C8',

        // =====================================
        // BACKGROUNDS
        // =====================================

        'cream': '#FAF7F0',
        'warm-white': '#FFFEFC',

        'dark-bg': '#1A1512',
        'dark-card': '#28221E',

        // =====================================
        // TEXT COLORS
        // =====================================

        'warm-brown': '#28221E',
        'dark-text': '#E8DCC8',

        'muted': '#8B8179',
        'muted-light': '#A49A91',

        // =====================================
        // BORDERS
        // =====================================

        'warm-border': '#EEE7DF',

        // =====================================
        // BACKWARD COMPATIBILITY
        // Keep old classes working
        // =====================================

        'orange-accent': '#DBC29C',
      },

      // =====================================
      // TYPOGRAPHY
      // =====================================

      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },

      // =====================================
      // SHADOWS
      // =====================================

      boxShadow: {
        'soft': '0 10px 40px -10px rgba(40, 34, 30, 0.06)',

        'card': '0 4px 20px rgba(40, 34, 30, 0.05)',

        'card-hover': '0 15px 35px rgba(40, 34, 30, 0.10)',

        'pink': '0 8px 25px rgba(219,194,156,0.20)',
      },

      // =====================================
      // BORDER RADIUS
      // =====================================

      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // =====================================
      // ANIMATIONS
      // =====================================

      animation: {
        'fade-in': 'fadeIn 0.6s ease-out both',
        'slide-up': 'slideUp 0.6s ease-out both',
        'float': 'float 4s ease-in-out infinite',
        'slow-zoom': 'slowZoom 15s ease-in-out infinite',
      },
    },
  },

  plugins: [],
};
