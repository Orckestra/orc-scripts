const { parseEnv } = require("../utils");

const isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === "test";
const isWebpack = parseEnv("BUILD_WEBPACK", false);

const envTargets = isTest
	? { node: "current" }
	: isWebpack ? ["defaults", "IE 11"] : { node: "4.5" };

const envOptions = { loose: true, targets: envTargets };

module.exports = {
	presets: [[require.resolve("babel-preset-env"), envOptions]],
	plugins: [
		isWebpack ? require.resolve("babel-plugin-transform-react-jsx") : null,
		isWebpack ? require.resolve("babel-plugin-styled-components") : null,
		require.resolve("babel-plugin-transform-object-rest-spread"),
	].filter(x => !!x),
};
