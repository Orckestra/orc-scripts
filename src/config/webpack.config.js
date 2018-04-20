const webpack = require("webpack");
const path = require("path");
const { parseEnv } = require("../utils");

const ASSET_PATH = process.env.ASSET_PATH || "/";

module.exports = {
	mode: "development",
	entry: path.resolve("./src/index.js"),
	output: {
		filename: "bundle.js",
		path: path.resolve(process.cwd(), "dist"),
		publicPath: process.env.WEBPACK_PUBLIC_PATH || "/",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
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
		modules: ["src", "node_modules"],
		alias: {
			// Insist on the local instance of styled-components to avoid duplicates
			"styled-components": path.resolve(
				process.cwd(),
				"node_modules",
				"styled-components",
			),
		},
	},
	plugins: [
		// This makes it possible for us to safely use env vars on our code
		new webpack.DefinePlugin({
			"process.env.ASSET_PATH": JSON.stringify(ASSET_PATH),
		}),
	],
	devtool: undefined,
};

if (parseEnv("NODE_ENV") === "development") {
	module.exports.devtool = "inline-source-map";
	module.exports.plugins.push(
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	);
}
