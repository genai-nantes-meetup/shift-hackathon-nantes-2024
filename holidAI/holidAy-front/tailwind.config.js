module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      colors: {
        "primary": '#181820',
        "secondary": "#343943",
        "secondary-dark": "#181820",
        "bubble-user": '#DFD5EF',
        "primary-purple": "#696FFF",
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'primary-bg': "url('./public/background-planet.jpeg')",
      },
      scrollbar: {
        width: '10px',
        height: '10px',
        thumbColor: '#4a4a4a',
        thumbBorderRadius: '10px',
        trackColor: '#1a1a1a',
      },

    },
  },
  variants: {},
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}