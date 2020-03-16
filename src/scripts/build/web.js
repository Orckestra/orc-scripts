const config = require("../../config/webpack.config");
const webpack = require("webpack");

const args = process.argv.slice(2);

if (args.includes("--stats")) {
	const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
	config.plugins.push(new BundleAnalyzerPlugin());
}

webpack(config, (err, stats) => {
	if (err) {
		console.error(err.stack || err);
		process.exit(-2);
	}
	console.log(
		stats.toString({
			colors: true,
		}),
	);
	if (stats.hasErrors()) {
		process.exit(-1);
	}
});
