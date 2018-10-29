const babelJest = require("babel-jest");
const config = require("./babelrc");

module.exports = babelJest.createTransformer(
	config({
		env: function() {
			return "test"; // Jest always runs in "test" env
		},
	}),
);
