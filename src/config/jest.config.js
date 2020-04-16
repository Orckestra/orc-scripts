const path = require("path");
const { hasFile, hasPkgProp, fromRoot } = require("../utils");

const here = p => path.join(__dirname, p);

const args = process.argv.slice(2);
const isCI = require("is-ci") || args.includes("--ci");

const useBuiltInBabelConfig =
	(!hasFile(".babelrc") || !hasFile("babel.config.js")) && !hasPkgProp("babel");

const ignores = ["/node_modules/"];

const jestConfig = {
	roots: [fromRoot("src")],
	testEnvironment: "jsdom",
	resolver: here("jest-resolver.js"),
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif)$": here("../__mocks__/fileMock.js"),
	},
	modulePaths: [fromRoot("src"), fromRoot("node_modules")],
	modulePathIgnorePatterns: ["node_modules/orc-[a-z]+/node_modules"],
	moduleFileExtensions: ["js", "json"],
	collectCoverageFrom: ["src/**/*.js"],
	globals: {
		BUILD_ID: "000",
		BUILD_NUMBER: "000",
		OVERTURE_MODULE: "aModule"
	},
	setupFiles: [require.resolve("whatwg-fetch")],
	setupFilesAfterEnv: [here("unexpected.js")],
	testMatch: ["**/*.test.js"],
	testPathIgnorePatterns: [...ignores],
	testURL: "http://localhost:8000/",
	verbose: true,
};

if (!isCI) {
	jestConfig["coverageReporters"] = ["html", "text-summary"];
}

if (useBuiltInBabelConfig) {
	jestConfig["transform"] = { "^.+\\.js$": here("./babel-transform") };
	const whitelist = require("./babel-whitelist.json");
	jestConfig["transformIgnorePatterns"] = [
		"/node_modules/(?!(?:" + whitelist.join("|") + ")/)",
	];
}

module.exports = jestConfig;
