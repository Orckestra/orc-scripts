const webpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");

const config = require("../config/webpack.config.js");
const options = {
	contentBase: "./dist",
	hot: true,
	host: "localhost",
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

const PORT = process.env.PORT || 5000;

server.listen(PORT, "localhost", () => {
	console.log("dev server listening on port " + PORT);
});
