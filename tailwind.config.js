/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './projects/**/*.{html,ts}',
    './docs/**/*.md'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFB800',
        secondary: '#7C3AED',
        accent: '#FF6B88',
        background: '#111827',
        surface: '#F9FAFB'
      },
      fontFamily: {
        display: ['"Inter"', 'Nunito', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'Nunito', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'emoji-card': '0 20px 45px rgba(17, 17, 39, 0.4)'
      },
      animation: {
        float: 'float 12s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0px)' }
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(20px,-30px,0) rotate(6deg)' },
          '100%': { transform: 'translate3d(0,0,0) rotate(0deg)' }
        }
      }
    }
  },
  plugins: []
};
