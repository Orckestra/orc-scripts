const eslintrc = {
	extends: ["react-app"],
	rules: {
		"jsx-a11y/href-no-hash": "off",
	},
	globals: {
		SUPPORTED_LOCALES: false,
		OCSApiPath: false,
		jsdom: false,
	},
};

module.exports = eslintrc;
