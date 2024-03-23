/* eslint-disable quote-props */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['eslint-plugin-svelte', '@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
