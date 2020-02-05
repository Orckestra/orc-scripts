const path = require("path");
const { hasFile, hasPkgProp, fromRoot } = require("../utils");

const here = p => path.join(__dirname, p);

const useBuiltInBabelConfig =
	(!hasFile(".babelrc") || !hasFile("babel.config.js")) && !hasPkgProp("babel");

const ignores = ["/node_modules/"];

const jestConfig = {
	roots: [fromRoot("src")],
	testEnvironment: "jsdom",
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
	setupFilesAfterEnv: [here("unexpected.js"), here("consoleMock.js")],
	testMatch: ["**/*.test.js"],
	testPathIgnorePatterns: [...ignores],
	testURL: "http://localhost:8000/",
	verbose: true,
};

if (useBuiltInBabelConfig) {
	jestConfig["transform"] = { "^.+\\.js$": here("./babel-transform") };
}

module.exports = jestConfig;
