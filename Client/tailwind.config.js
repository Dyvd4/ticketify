const colors = require("tailwindcss/colors")

const config = {
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
      scale: ['active'],
      ringWidth: ["active"],
      display: ["group-hover"]
    }
  },
  theme: {
    colors: Object.keys(colors).reduce((map, color) => {
      map[color] = colors[color];
      return map;
    }, {})
  },
  plugins: []
}

module.exports = config;
