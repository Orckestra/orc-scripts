// Created by https://github.com/gcangussu
// Taken from https://gist.github.com/gcangussu/af52da296aef829eba15ea626453f031

const resolve = require("resolve");

/**
 * @typedef {{
    basedir: string;
    browser?: boolean;
    defaultResolver: (request: string, options: ResolverOptions) => string;
    extensions?: readonly string[];
    moduleDirectory?: readonly string[];
    paths?: readonly string[];
    rootDir?: string;
  }} ResolverOptions
 */

/**
 * @param {string} request
 * @param {ResolverOptions} options
 */
module.exports = (request, options) => {
	try {
		const path = resolve.sync(request, {
			basedir: options.rootDir || options.basedir,
			extensions: options.extensions,
			preserveSymlinks: true,
		});
		if (request === "react" || request === "react-dom") {
			console.log(request, path);
		}
		return path;
	} catch (e) {
		if (e.code === "MODULE_NOT_FOUND") {
			return options.defaultResolver(request, options);
		}
		throw e;
	}
};
