// @flow
type ESLintRC = {
	extends: Array<string>,
	rules: { [string]: string | Array<string> },
};

const eslintrc: ESLintRC = {
	extends: ["plugin:flowtype/recommended", "react-app"],
	rules: {
		"jsx-a11y/href-no-hash": "off",
	},
};

module.exports = eslintrc;
