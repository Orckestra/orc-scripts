const DevServer = require("webpack-dev-server");
const webpack = require("webpack");

const HOST = process.env.HOSTNAME || "localhost";

const args = process.argv.slice(2);
const argPort = args.indexOf("--port") !== -1 ? args[args.indexOf("--port") + 1] : null;
const PORT = argPort || process.env.PORT || 5000;

const config = require("../config/webpack.config.js");
const options = {
	historyApiFallback: true,
	hot: "only",
	port: PORT,
	host: HOST,
	static: './dist',
	devMiddleware: {
		publicPath: process.env.WEBPACK_PUBLIC_PATH || "/",
	},
};

if (HOST !== "localhost") {
	options.public = HOST;
}
if (HOST !== "localhost" || args.indexOf("--https") !== -1 || process.env.HTTPS) {
	options.server = 'https';
}

const compiler = webpack(config);

const server = new DevServer(options, compiler);

(async () => {
	await server.start();
})();
