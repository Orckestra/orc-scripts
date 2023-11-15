const webpack = require("webpack");
const path = require("path");
const readPkgUp = require("read-pkg-up");
const { parseEnv } = require("../utils");

const { packageJson } = readPkgUp.sync({ normalize: false }) || {};

const here = p => path.join(__dirname, p);

const babelWhitelist = require("./babel-whitelist.json");

const config = {
	entry: [here("setAssetPath.js"), "url-polyfill", "core-js", "whatwg-fetch", path.resolve("./src/index.js")],
	output: {
		chunkFilename: "[id].[chunkhash].js",
		filename: "bundle.js",
		path: path.resolve(process.cwd(), "dist"),
	},
	resolve: {
		alias: {},
		modules: [
			// Always resolve in local src and node_modules
			path.resolve(process.cwd(), "src"),
			path.resolve(process.cwd(), "node_modules"),
		],
		symlinks: false,
	},
	module: {
		rules: [
			{
				test: /\.js$/, // Only JavaScript files
				exclude: {
					and: [/node_modules/], // Exclude libraries in node_modules ...
					not: [
						// Except for a few of them that needs to be transpiled because they use modern syntax
						// Allowed by whitelist
						babelWhitelist.map(
							lib => new RegExp("node_modules(?:/|\\\\)" + lib.replace("/", "(?:/|\\\\)") + "(?:/|\\\\)"),
						),
					]
				},
				use: [
					{
						loader: "babel-loader",
						options: require("./babelrc.js"),
					},
				],
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
				type: 'asset/inline',
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			BUILD_ID: `"${process.env.BUILD_BUILDID}"`,
			BUILD_NUMBER: `"${process.env.BUILD_BUILDNUMBER}"`,
		}),
	],
};

const locales = packageJson.locales;
const overtureApplication = packageJson.overtureApplication;
const dependencies = packageJson.dependencies;

config.plugins.push(
	new webpack.DefinePlugin({
		SUPPORTED_LOCALES: JSON.stringify(locales && locales.length ? locales : null),
		OVERTURE_APPLICATION: JSON.stringify((overtureApplication && overtureApplication.name) || ""),
		DEPENDENCIES: JSON.stringify(dependencies || {}),
	}),
);

if (parseEnv("NODE_ENV") === "production") {
	config.devtool = "source-map";
	config.mode = "production";
} else {
	config.devtool = "inline-source-map";
	config.optimization = {
		usedExports: true,
		moduleIds: 'named',
	};
	config.mode = "development";
}

module.exports = config;
