/* eslint-disable quote-props */
module.exports = {
	env: {
		es6: true,
		node: true
	},
	parserOptions: {
		ecmaVersion: 2018
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	overrides: [
		{
			files: ['**/*.spec.*'],
			env: {
				mocha: true
			},
			rules: {}
		}
	],
	globals: {}
};
