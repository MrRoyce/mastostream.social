/** @type {import('tailwindcss').Config}*/
import tailwindcss from 'tailwindcss';
const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin'), tailwindcss()],

	darkMode: 'class',

	theme: {
		extend: {}
	}
};

module.exports = config;
