const webpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");

const HOST = process.env.HOSTNAME || "localhost";

const args = process.argv.slice(2);
const argPort =
	args.indexOf("--port") !== -1 ? args[args.indexOf("--port") + 1] : null;
const PORT = argPort || process.env.PORT || 5000;

const config = require("../config/webpack.config.js");
const options = {
	contentBase: "./dist",
	publicPath: process.env.WEBPACK_PUBLIC_PATH || "/",
	historyApiFallback: true,
	hotOnly: true,
	port: PORT,
	host: HOST,
};

if (HOST !== "localhost") {
	options.public = HOST;
}
if (
	HOST !== "localhost" ||
	args.indexOf("--https") !== -1 ||
	process.env.HTTPS
) {
	options.https = true;
}

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

const location =
	"http" + (options.https ? "s" : "") + "://" + HOST + ":" + PORT;

server.listen(PORT, "localhost", () => {
	console.log("dev server listening at " + location);
});
