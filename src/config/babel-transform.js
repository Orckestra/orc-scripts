// @flow
const babelJest = require("babel-jest");
const config = require("./babelrc");

module.exports = babelJest.createTransformer(config);
