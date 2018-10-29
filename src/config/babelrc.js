const { parseEnv } = require("../utils");

const isWebpack = parseEnv("BUILD_WEBPACK", false);
const isReact = parseEnv("BUILD_REACT", isWebpack);

module.exports = function(api) {
	const isTest = api.env() === "test";
	const envTargets = isTest
		? { node: "current" }
		: isWebpack
			? ["defaults", "IE 11"]
			: { node: "4.5" };
	const envOptions = { loose: true, targets: envTargets };
	const presets = [[require.resolve("@babel/preset-env"), envOptions]];
	const plugins = [
		isReact ? require.resolve("babel-plugin-styled-components") : null,
		require.resolve("@babel/plugin-transform-template-literals"),
		isReact ? require.resolve("react-hot-loader/babel") : null,
		isReact ? require.resolve("@babel/plugin-transform-react-jsx") : null,
		isReact
			? [
					require.resolve("babel-plugin-react-intl-auto"),
					{ removePrefix: "src", filebase: true },
			  ]
			: null,
		require.resolve("@babel/plugin-proposal-object-rest-spread"),
		require.resolve("@babel/plugin-transform-computed-properties"),
	].filter(x => !!x);
	return {
		presets,
		plugins,
	};
};
