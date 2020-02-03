const path = require("path");
const { parseEnv, hasFile, hasPkgProp, fromRoot } = require("../utils");
const isWeb = parseEnv("BUILD_REACT", parseEnv("BUILD_WEBPACK", false));

const here = p => path.join(__dirname, p);

const args = process.argv.slice(2);
const isCI = require("is-ci") || args.includes("--ci");

const useBuiltInBabelConfig =
	(!hasFile(".babelrc") || !hasFile("babel.config.js")) && !hasPkgProp("babel");

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
		"react-redux": path.resolve(process.cwd(), "node_modules", "react-redux"),
	},
	modulePaths: ["<rootDir>/src/", "<rootDir>/node_modules/"],
	moduleFileExtensions: ["js", "json"],
	collectCoverageFrom: ["src/**/*.js"],
	setupFiles: [require.resolve("whatwg-fetch")],
	setupFilesAfterEnv: [here("unexpected.js")],
	testMatch: ["**/*.test.js"],
	testPathIgnorePatterns: [...ignores],
	verbose: true,
};

if (!isCI) {
	jestConfig["coverageReporters"] = ["html", "text-summary"];
}

if (isWeb) {
	jestConfig["testURL"] = "http://localhost:8000/";
}

if (useBuiltInBabelConfig) {
	jestConfig["transform"] = { "^.+\\.js$": here("./babel-transform") };
}

module.exports = jestConfig;
