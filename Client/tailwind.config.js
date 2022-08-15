module.exports = {
  content: [],
  important: true,
  corePlugins: {
    preflight: false
  },
  darkMode: 'class', // or 'media'
  variants: {
    extend: {
      backgroundColor: ['active'],
      textColor: ['active'],
      scale: ['active']
    },
  },
  theme: {
    extend: {},
  },
  plugins: [],
}
