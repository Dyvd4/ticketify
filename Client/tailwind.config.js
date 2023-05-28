/** @type {import('tailwindcss').Config} */

const config = {
	content: ["./src/**/*.{html,tsx}"],
	important: true,
	corePlugins: {
		preflight: false,
	},
	darkMode: "class", // or 'media'
	variants: {
		extend: {
			backgroundColor: ["active"],
			textColor: ["active"],
			scale: ["active"],
			ringWidth: ["active"],
			display: ["group-hover"],
		},
	},
	theme: {},
	plugins: [],
};

module.exports = config;
