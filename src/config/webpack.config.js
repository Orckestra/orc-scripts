const webpack = require("webpack");
const path = require("path");
const pkgConf = require("pkg-conf");
const { parseEnv } = require("../utils");

const here = p => path.join(__dirname, p);

module.exports = {
	entry: [
		here("setAssetPath.js"),
		"url-polyfill",
		"core-js",
		"whatwg-fetch",
		path.resolve("./src/index.js"),
	],
	output: {
		chunkFilename: "[id].[chunkhash].js",
		filename: "bundle.js",
		path: path.resolve(process.cwd(), "dist"),
	},
	module: {
		rules: [
			{
				resource: {
					test: /\.js$/,
					or: [
						{ not: [/node_modules/] },
						/ansi-regex/,
						/strip-ansi/,
						/connected-react-router/,
					],
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
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
				use: {
					loader: "url-loader",
					options: {
						limit: 50000,
					},
				},
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
	plugins: [],
};

const locales = Object.values(pkgConf.sync("locales"));
if (locales.length) {
	module.exports.plugins.push(
		new webpack.DefinePlugin({
			SUPPORTED_LOCALES: JSON.stringify(locales),
		}),
	);
}

if (parseEnv("NODE_ENV") === "production") {
	module.exports.devtool = "source-map";
	module.exports.mode = "production";
} else {
	module.exports.devtool = "inline-source-map";
	module.exports.optimization = { usedExports: true };
	module.exports.plugins.push(
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	);
	module.exports.mode = "development";
}
