/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#5947FD',
        'primary-dark': '#4836E8',
        'primary-light': '#6A58FE',
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0,0,0,0.2)',
      }
    }
  },
  plugins: []
}