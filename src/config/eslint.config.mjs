import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactHookConfig from "eslint-plugin-react-hooks";

export default [
	{ files: ["**/*.{js,mjs,cjs,jsx}"] },
	{ languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
	{ files: ["**/*.js"], languageOptions: { sourceType: "module" } },
	{ languageOptions: { globals: { ...globals.browser, ...globals.node, ...{ Intl: false } } } },
	pluginJs.configs.recommended,
	pluginReactConfig,
	{
		plugins: {
			"react-hooks": pluginReactHookConfig,
		},
		rules: pluginReactHookConfig.configs.recommended.rules,
	},
	{
		files: ["**/*.test.js"],
		languageOptions: { globals: { ...globals.jest } },
		rules: {
			"react/jsx-key": "off",
		},
	},
	{
		files: ["**/*.js"],
		rules: {
			"no-unused-vars": [
				"error",
				{
					vars: "all",
					args: "none",
					caughtErrors: "all",
					ignoreRestSiblings: false,
				},
			],
		},
	},
	{
		settings: {
			react: {
				version: "detect",
			},
		},
		languageOptions: {
			globals: {
				SUPPORTED_LOCALES: false,
				OVERTURE_APPLICATION: false,
				DEPENDENCIES: false,
				BUILD_ID: false,
				BUILD_NUMBER: false,
			},
		},
		rules: {
			"jsx-a11y/href-no-hash": "off",
			"react/prop-types": "off",
			"react/no-children-prop": "off",
			"react/display-name": "off",
			"no-mixed-spaces-and-tabs": "off",
			"no-case-declarations": "off",
		},
	},
];
