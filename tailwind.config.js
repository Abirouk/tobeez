/** @type {import('tailwindcss').Config} */
module.exports = {
	prefix: 'tw-',
	important: false,
	content: [
		"**/*.{html, jsx, js}",
		"**/*.js",
		"**/*.html",
	],
	// Configure Tailwind to use data-theme="dark" instead of class="dark"
	// This allows us to use CSS variables more consistently
	darkMode: ['class', '[data-theme="dark"]'],
	theme: {
		extend: {
			colors: {
				primary: '#FDB51B',
				secondary: "#080808",
				outlineColor: "#FDB51B",
				
				// Light mode and dark mode specific colors
				light: {
					bg: '#ffffff',
					text: '#000000',
					muted: '#595959',
					card: '#f7f7f7',
					border: '#e0e0e0',
				},
				dark: {
					bg: '#000000',
					text: '#ffffff',
					muted: '#a0a0a0',
					card: '#0f0f0f',
					border: '#1F2123',
				}
			},
			boxShadow: {
				'light': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
				'dark': '0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -4px rgba(0, 0, 0, 0.25)',
			},
			fontFamily: {
				'header': ['Godber', 'sans-serif'],
				'body': ['Raleway', 'sans-serif'],
			},
		},
	},
	plugins: [],
}