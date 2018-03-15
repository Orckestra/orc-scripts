// @flow
const webpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");

const config = require("../config/webpack.config.js");
const options = {
	contentBase: "./dist",
	historyApiFallback: true,
	hotOnly: true,
	host: "localhost",
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

const args = process.argv.slice(2);
const argPort =
	args.indexOf("--port") !== -1 ? args[args.indexOf("--port") + 1] : null;

const PORT = argPort || process.env.PORT || 5000;

server.listen(PORT, "localhost", () => {
	console.log("dev server listening on port " + PORT);
});
