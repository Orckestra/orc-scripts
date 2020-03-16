const {
	fromRoot,
	hasFile,
	hasPkgProp,
	ifAnyDep,
	parseEnv,
	resolveBin,
} = require("./utils");
const path = require("path");

describe("utils", () => {
	describe("fromRoot", () => {
		it("exists", () => expect(fromRoot, "to be a function"));

		it("appends directory parts to the currently running application's root directory", () =>
			expect(
				fromRoot,
				"when called with",
				["test", "dir"],
				"to equal",
				process.cwd() + path.sep + "test" + path.sep + "dir",
			));
	});

	describe("hasFile", () => {
		it("exists", () => expect(hasFile, "to be a function"));

		it("returns true when given file name that exists in CWD", () =>
			expect(hasFile, "when called with", ["package.json"], "to equal", true));

		it("returns false when given file name that does not exist in CWD", () =>
			expect(hasFile, "when called with", ["foo.bar"], "to equal", false));
	});

	describe("hasPkgProp", () => {
		it("exists", () => expect(hasPkgProp, "to be a function"));

		it("returns true if local package.json has at least one of the given first-level keys", () =>
			expect(
				hasPkgProp,
				"when called with",
				[["no", "lint-staged", "dont-have"]],
				"to equal",
				true,
			));

		it("returns false if local package.json does not have any of the given first-level keys", () =>
			expect(
				hasPkgProp,
				"when called with",
				[["no-such-key", "nuh-uh", "nope-not-here"]],
				"to equal",
				false,
			));
	});

	describe("ifAnyDep", () => {
		it("exists", () => expect(ifAnyDep, "to be a function"));

		it("returns the 'then' parameter if project has one of given dependencies", () =>
			expect(
				ifAnyDep,
				"when called with",
				[["wrong-dependency", "unexpected", "not-this-one"], "then param", "else param"],
				"to be",
				"then param",
			));

		it("returns the 'else' parameter if project has one of given dependencies", () =>
			expect(
				ifAnyDep,
				"when called with",
				[["wrong-dependency", "expect", "not-this-one"], "then param", "else param"],
				"to be",
				"else param",
			));
	});

	describe("parseEnv", () => {
		it("exists", () => expect(parseEnv, "to be a function"));

		it("returns the environment variable given if it exists", () =>
			expect(parseEnv, "when called with", ["BABEL_ENV", "wrong"], "to equal", "test"));

		it("returns default value if it does not exist", () =>
			expect(
				parseEnv,
				"when called with",
				["NO_SUCH_variable", "wrong"],
				"to equal",
				"wrong",
			));
	});

	describe("resolveBin", () => {
		it("exists", () => expect(resolveBin, "to be a function"));

		it.skip("resolveBin resolves to the full path when it's not in $PATH", () => {
			expect(
				resolveBin("@babel/cli", { executable: "babel" }),
				"to be",
				require.resolve("@babel/cli/bin/babel").replace(process.cwd(), "."),
			);
		});

		it("resolveBin resolves to the .bin path when it's in $PATH but local", () => {
			expect(
				resolveBin("@babel/cli", { executable: "babel" }),
				"to start with",
				require.resolve(".bin/babel").replace(process.cwd(), "."),
			);
		});

		it("resolveBin resolves to the binary if it's in $PATH", () => {
			expect(resolveBin("node"), "to be", "node");
		});
	});
});
