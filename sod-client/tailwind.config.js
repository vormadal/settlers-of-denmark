/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#FF6B6B',
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6b6b',
          500: '#f83e3e',
          600: '#e51e1e',
          700: '#c11414',
          800: '#a01414',
          900: '#841818',
        },
        secondary: {
          main: '#4ECDC4',
          50: '#f0fdfc',
          100: '#ccfbf6',
          200: '#99f6ec',
          300: '#5eebe0',
          400: '#4ecdc4',
          500: '#26c6bb',
          600: '#1ea19a',
          700: '#1e807c',
          800: '#1f6663',
          900: '#1f5553',
        },
        error: {
          main: '#ff1744',
        }
      },
      fontFamily: {
        'sans': ['"Quicksand"', '"Roboto"', '"Helvetica"', '"Arial"', 'sans-serif'],
      },
      fontSize: {
        'h6': ['1.1rem', { fontWeight: '700' }],
        'body1': ['0.95rem', { fontWeight: '600' }],
        'body2': ['1.2rem', { fontWeight: '700' }],
      },
      screens: {
        'md': '900px', // MUI's default md breakpoint
      },
      spacing: {
        '13': '3.25rem', // 52px for button size
        '15': '3.75rem', // 60px for medium dice
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'subtle-pulse': 'subtle-pulse 3s ease-in-out infinite',
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
