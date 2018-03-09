const path = require("path");
const { parseEnv, hasFile, hasPkgProp, fromRoot } = require("../utils");
const isWebpack = parseEnv("BUILD_WEBPACK", false);

const here = p => path.join(__dirname, p);

const useBuiltInBabelConfig = !hasFile(".babelrc") && !hasPkgProp("babel");

const ignores = ["/node_modules/"];

const jestConfig = {
	roots: [fromRoot("src")],
	testEnvironment: isWebpack ? "jsdom" : "node",
	modulePaths: ["src"],
	moduleFileExtensions: ["js", "json"],
	collectCoverageFrom: ["src/**/*.js"],
	setupTestFrameworkScriptFile: here("unexpected.js"),
	testMatch: ["**/*.test.js"],
	testPathIgnorePatterns: [...ignores],
	verbose: true,
};

if (isWebpack) {
	jestConfig.testURL = "http://localhost:8000/";
}

if (useBuiltInBabelConfig) {
	jestConfig.transform = { "^.+\\.js$": here("./babel-transform") };
}

module.exports = jestConfig;
