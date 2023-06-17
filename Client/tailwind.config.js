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
	safelist: [
		"h1.ce-header",
		"h2.ce-header",
		"h3.ce-header",
		"h4.ce-header",
		"h5.ce-header",
		"h6.ce-header",
		".ce-popover",
		".ce-inline-toolbar",
		".ce-toolbar__actions",
		".ce-toolbar__plus",
		".ce-toolbar__settings-btn",
	],
};

module.exports = config;
