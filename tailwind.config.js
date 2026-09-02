/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1B2A4A',
          'navy-soft': '#2A3F66',
          gold: '#6E2438',
          'gold-dark': '#54182A',
          cream: '#EFE7DA',
          ink: '#211D18',
          'ink-soft': '#5B5347',
          rose: '#E4A6B4',
          white: '#FFFFFF',
        },
        units: {
          1: '#6E2438',
          2: '#C98A2B',
          3: '#3E7A5D',
          4: '#B65330',
          5: '#1F5C73',
          6: '#6B3557',
          7: '#6B7A3E',
        },
      },
      fontFamily: {
        serif: ['Cambria', 'Georgia', 'ui-serif', 'serif'],
        sans: ['Inter', 'Calibri', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 14px 0 rgba(27, 42, 74, 0.08)',
        'card-hover': '0 10px 30px 0 rgba(27, 42, 74, 0.16)',
      },
    },
  },
  plugins: [],
}
