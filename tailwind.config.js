module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        lg: '1124px',
        xl: '1124px',
        '2xl': '1124px',
      },
    },
    extend: {
      colors: {
        'wise-purple': '#5F5CEA',
        'wise-red': '#68E1FD',
        'wise-blue': '#242A45',
        'wise-grey': '#9194A2',
        'wise-white': '#F7F7F7',
      },
    },
  },
  plugins: [],
};
