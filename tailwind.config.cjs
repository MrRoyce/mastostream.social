/** @type {import('tailwindcss').Config}*/
import tailwindcss from 'tailwindcss';
import { skeleton } from '@skeletonlabs/tw-plugin';
const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [
		require('flowbite/plugin'),
		tailwindcss(),
		skeleton({
			themes: {
				preset: [
					{
						name: 'skeleton',
						enhancements: true
					}
				]
			}
		})
	],

	darkMode: 'class',

	theme: {
		extend: {}
	}
};

module.exports = config;
