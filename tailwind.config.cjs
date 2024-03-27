import { join } from 'path';
/** @type {import('tailwindcss').Config}*/
import tailwindcss from 'tailwindcss';
// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';
const config = {
	content: [
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
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
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				}
			}
		}
	}
};

module.exports = config;
