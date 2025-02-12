const webpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

const HOST = process.env.HOSTNAME || "localhost";

const args = process.argv.slice(2);
const argPort = args.indexOf("--port") !== -1 ? args[args.indexOf("--port") + 1] : null;
const PORT = argPort || process.env.PORT || 5000;

const findSslPasswordFromParametersFile = (certFile) => {
	// reference: https://hals.app/blog/recursively-read-parent-folder-nodejs/

	let parentDirectory = path.dirname(certFile);
	while (fs.existsSync(parentDirectory)) {
		console.log("Looking for certificate password in: " + parentDirectory)
		const fileToFindPath = path.join(parentDirectory, "parameters.dev.xml");
		if (fs.existsSync(fileToFindPath)) {
			const fileContent = fs.readFileSync(fileToFindPath, "utf8");

			// Using regex to parse the XML to avoid adding a dependency on an XML package

			const matchResult = /<param\s+name="SSL_CertificatePfxPassword"\s+value="(?<Value>[^"]+)"\s*\/>/.exec(fileContent);
			if (matchResult && matchResult.groups && matchResult.groups['Value']) {
				console.log("Certificate password found");
				return matchResult.groups['Value'];
			}

			console.warn("Could not find SSL_CertificatePfxPassword in file " + fileToFindPath)
			return null;
		}

		// The trick is here:
		// Using path.dirname() of a directory returns the parent directory!
		const parentDirname = path.dirname(parentDirectory);
		// But only to a certain point (file system root) (So to avoid infinite loops lets stop here)
		if (parentDirectory === parentDirname) {
			return null;
		}

		parentDirectory = parentDirname;
	}

	return null;
}

const config = require("../config/webpack.config.js");
const options = {
	contentBase: "./dist",
	publicPath: process.env.WEBPACK_PUBLIC_PATH || "/",
	historyApiFallback: true,
	hotOnly: true,
	port: PORT,
	host: HOST,
};

if (HOST !== "localhost" || args.indexOf("--https") !== -1 || process.env.HTTPS) {
	options.https = true;
}

if (options.https === true && process.env.SSL_CERT_PATH) {
	options.https = {
		https: true,
		pfx: process.env.SSL_CERT_PATH,
		passphrase: process.env.SSL_CERT_PASSWORD || findSslPasswordFromParametersFile(process.env.SSL_CERT_PATH),
	};
}

const location = "http" + (options.https ? "s" : "") + "://" + HOST + ":" + PORT;

// /mockData/ contains json files to simulate API endpoints
options.before = (app, server) => {
	app.get("/mockData/*", (req, res, next) => {
		const parsedUrl = new URL(req.url, location);
		parsedUrl.pathname = parsedUrl.pathname + ".json";
		req.url = parsedUrl.href.replace(location, "");
		next();
	});
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(PORT, HOST, () => {
	console.log("dev server listening at " + location);
});
