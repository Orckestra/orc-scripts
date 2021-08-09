module.exports = function (api) {
	api.cache.forever();
	return require("./babelrc.js");
};
