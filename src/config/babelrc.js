const { parseEnv } = require("../utils");

const isTest =
	process.env.NODE_ENV === "test" || process.env.BABEL_ENV === "test";
const isWebpack = parseEnv("BUILD_WEBPACK", false);
const isReact = parseEnv("BUILD_REACT", isWebpack);

const envTargets = isTest
	? { node: "current" }
	: isWebpack
	? ["defaults", "IE 11"]
	: { node: "10" };

const envOptions = { loose: true, targets: envTargets };
module.exports = {
	presets: [[require.resolve("@babel/preset-env"), envOptions]],
	plugins: [
		require.resolve("@babel/plugin-syntax-dynamic-import"),
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
	].filter(x => !!x),
};
