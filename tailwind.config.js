/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
      colors: {
        teal: {
          50: '#E1F5EE', 100: '#9FE1CB', 200: '#5DCAA5',
          400: '#1D9E75', 600: '#0F6E56', 800: '#085041', 900: '#04342C',
        },
        amber: {
          50: '#FAEEDA', 100: '#FAC775', 200: '#EF9F27',
          400: '#BA7517', 600: '#854F0B',
        },
      },
      borderRadius: { '2xl': '16px', '3xl': '24px' },
    },
  },
  plugins: [],
}
