const path = require("path");
const { parseEnv, hasFile, hasPkgProp, fromRoot } = require("../utils");
const isWeb = parseEnv("BUILD_REACT", parseEnv("BUILD_WEBPACK", false));

const here = p => path.join(__dirname, p);

const useBuiltInBabelConfig = !hasFile(".babelrc") && !hasPkgProp("babel");

const ignores = ["/node_modules/"];

const jestConfig = {
	roots: [fromRoot("src")],
	testEnvironment: isWeb ? "jsdom" : "node",
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif)$": here("../__mocks__/fileMock.js"),
		"styled-components": path.resolve(
			process.cwd(),
			"node_modules",
			"styled-components",
		),
	},
	modulePaths: ["src"],
	moduleFileExtensions: ["js", "json"],
	collectCoverageFrom: ["src/**/*.js"],
	setupTestFrameworkScriptFile: here("unexpected.js"),
	testMatch: ["**/*.test.js"],
	testPathIgnorePatterns: [...ignores],
	verbose: true,
};

if (isWeb) {
	jestConfig["testURL"] = "http://localhost:8000/";
}

if (useBuiltInBabelConfig) {
	jestConfig["transform"] = { "^.+\\.js$": here("./babel-transform") };
}

module.exports = jestConfig;
