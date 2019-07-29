const config = require("../../config/webpack.config");
const webpack = require("webpack");

const args = process.argv.slice(2);

if (args.includes("--stats")) {
	const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
		.BundleAnalyzerPlugin;
	config.plugins.push(new BundleAnalyzerPlugin());
}

webpack(config, (err, stats) => {
	console.log(
		stats.toString({
			colors: true,
		}),
	);
});
