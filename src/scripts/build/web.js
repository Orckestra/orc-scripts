// @flow
const config = require("../../config/webpack.config");
const webpack = require("webpack");

webpack(config, (err, stats) => {
	console.log(
		stats.toString({
			colors: true,
		}),
	);
});
