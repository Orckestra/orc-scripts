const path = require("path");
const { fromRoot } = require("../utils");

const here = p => path.join(__dirname, p);

const args = process.argv.slice(2);
const isCI = require("is-ci") || args.includes("--ci");

const ignores = ["/node_modules/"];

const jestConfig = {
	roots: [fromRoot("src")],
	testEnvironment: "jsdom",
	resolver: here("jest-resolver.js"),
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif)$": here("../__mocks__/fileMock.js"),
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
	},
	modulePaths: [fromRoot("src"), fromRoot("node_modules")],
	modulePathIgnorePatterns: ["node_modules/orc-[a-z]+/node_modules"],
	moduleFileExtensions: ["js", "json"],
	collectCoverageFrom: ["src/**/*.js"],
	globals: {
		BUILD_ID: "000",
		BUILD_NUMBER: "000",
		OVERTURE_APPLICATION: "anApplication",
		DEPENDENCIES: { someDependant: "1.1.1" },
	},
	setupFiles: [require.resolve("whatwg-fetch")],
	setupFilesAfterEnv: [here("unexpected.js"), here("./jestSetupFiles.js")],
	transform: { "^.+\\.js$": here("./babel-transform") },
	transformIgnorePatterns: ["/node_modules/(?!(?:" + require("./babel-whitelist.json").join("|") + ")/)"],
	testMatch: ["**/*.test.js"],
	testPathIgnorePatterns: [...ignores],
	testURL: "http://localhost:8000/",
	verbose: true,
};

if (!isCI) {
	jestConfig["coverageReporters"] = ["html", "text-summary"];
} else {
	jestConfig["coverageReporters"] = ["json", "lcov", "text", "clover", "cobertura"];
}

module.exports = jestConfig;
