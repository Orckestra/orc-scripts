const webpack = require("webpack");
const path = require("path");
const readPkgUp = require("read-pkg-up");
const { parseEnv } = require("../utils");

const { packageJson } = readPkgUp.sync({ normalize: false }) || {};

const here = p => path.join(__dirname, p);

const babelWhitelist = require("./babel-whitelist.json");

const config = {
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
	resolve: {
		alias: {
			// Needing two versions of date-fns makes things problematic
			// XXX: lint-staged uses listr, which uses date-fns@1 - they are working on changing to listr2
			// XXX: If Kalendaryo is updated to a version using date-fns@2, this can go away
			"date-fns": path.resolve(
				process.cwd(),
				"node_modules",
				"kalendaryo",
				"node_modules",
				"date-fns",
			),
			"date-fns-2": path.resolve(process.cwd(), "node_modules", "date-fns"),
		},
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
				resource: {
					test: /\.js$/, // Only JavaScript files
					or: [
						// One of these conditions must be true
						{ not: [/node_modules/] }, // No dependencies unless explicitly allowed by whitelist
					].concat(
						// Allowed by whitelist
						babelWhitelist.map(
							lib =>
								new RegExp(
									"node_modules(?:/|\\\\)" +
										lib.replace("/", "(?:/|\\\\)") +
										"(?:/|\\\\)",
								),
						),
					),
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
				use: {
					loader: "url-loader",
					options: {
						limit: 50000,
					},
				},
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
const overtureModule = packageJson.overtureModule;
const dependencies = packageJson.dependencies;

config.plugins.push(
	new webpack.DefinePlugin({
		SUPPORTED_LOCALES: JSON.stringify(locales && locales.length ? locales : null),
		OVERTURE_MODULE: JSON.stringify((overtureModule && overtureModule.name) || ""),
		DEPENDENCIES: JSON.stringify(dependencies || {}),
	}),
);

if (parseEnv("NODE_ENV") === "production") {
	config.devtool = "source-map";
	config.mode = "production";
} else {
	config.devtool = "inline-source-map";
	config.optimization = { usedExports: true };
	config.plugins.push(
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	);
	config.mode = "development";
}

module.exports = config;
