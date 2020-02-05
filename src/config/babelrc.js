const { parseEnv } = require("../utils");

const isTest =
	process.env.NODE_ENV === "test" || process.env.BABEL_ENV === "test";
const isWebpack = parseEnv("BUILD_WEBPACK", false);
const isReact = parseEnv("BUILD_REACT", isWebpack);

const envTargets = isTest
	? "current node, last 2 chrome version"
	: isReact
	? "defaults, IE 11"
	: "node 10";

console.log("Using targets", envTargets);

const envOptions = { loose: true, targets: envTargets };
module.exports = {
	presets: [[require.resolve("@babel/preset-env"), envOptions]],
	plugins: [
		require.resolve("@babel/plugin-syntax-dynamic-import"),
		isTest || isReact
			? require.resolve("babel-plugin-styled-components")
			: null,
		require.resolve("@babel/plugin-transform-template-literals"),
		require.resolve("@babel/plugin-transform-destructuring"),
		require.resolve("@babel/plugin-proposal-object-rest-spread"),
		isTest || isReact ? require.resolve("react-hot-loader/babel") : null,
		isTest || isReact ? require.resolve("@loadable/babel-plugin") : null,
		isTest || isReact
			? require.resolve("@babel/plugin-transform-react-jsx")
			: null,
		isTest || isReact
			? [
					require.resolve("babel-plugin-react-intl-auto"),
					{ removePrefix: "src", filebase: true },
			  ]
			: null,
		require.resolve("@babel/plugin-transform-computed-properties"),
	].filter(x => !!x),
};
