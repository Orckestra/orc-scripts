const eslintrc = {
	extends: ["react-app"],
	rules: {
		"jsx-a11y/href-no-hash": "off",
	},
	globals: {
		SUPPORTED_LOCALES: false,
		OVERTURE_MODULE: false,
		BUILD_ID: false,
		BUILD_NUMBER: false,
	},
};

module.exports = eslintrc;
