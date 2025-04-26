/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './index.html',
      './src/**/*.{html,js,ts,jsx,tsx,css}',
    ],
    theme: {
      extend: {
        colors: {
          brown: { 600: '#4A2C2A' },
        },
      },
    },
    plugins: [],
  }