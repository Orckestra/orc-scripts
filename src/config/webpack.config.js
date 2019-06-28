const webpack = require("webpack");
const path = require("path");
const pkgConf = require("pkg-conf");
const { parseEnv } = require("../utils");

const ASSET_PATH = process.env.ASSET_PATH || "/";

module.exports = {
	mode: "development",
	entry: [
		"url-polyfill",
		"core-js",
		"whatwg-fetch",
		path.resolve("./src/index.js"),
	],
	output: {
		filename: "bundle.js",
		path: path.resolve(process.cwd(), "dist"),
		publicPath: process.env.WEBPACK_PUBLIC_PATH || "/",
	},
	module: {
		rules: [
			{
				resource: {
					test: /\.js$/,
					or: [{ not: [/node_modules/] }, /ansi-regex/, /strip-ansi/],
				},
				use: {
					loader: "babel-loader",
					options: require("./babelrc.js"),
				},
			},
			{
				test: /\.svg$/,
				loader: "svg-inline-loader",
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				use: ["file-loader", "img-loader"],
			},
		],
	},
	resolve: {
		modules: [
			// Always resolve in local src and node_modules
			path.resolve(process.cwd(), "src"),
			path.resolve(process.cwd(), "node_modules"),
		],
	},
	plugins: [
		// This makes it possible for us to safely use env vars on our code
		new webpack.DefinePlugin({
			"process.env.ASSET_PATH": JSON.stringify(ASSET_PATH),
		}),
	],
	devtool: undefined,
};

const locales = Object.values(pkgConf.sync("locales"));
if (locales.length) {
	module.exports.plugins.push(
		new webpack.DefinePlugin({
			SUPPORTED_LOCALES: JSON.stringify(locales),
		}),
	);
}

if (parseEnv("NODE_ENV") === "development") {
	module.exports.devtool = "inline-source-map";
	module.exports.plugins.push(
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	);
}
