const path = require("path");
const { hasPkgProp, resolveBin, hasFile } = require("../../utils");
const spawn = require("cross-spawn");

const here = p => path.join(__dirname, p);

const args = process.argv.slice(2);

const useSpecifiedOutDir = args.includes("--out-dir");
const outDir = useSpecifiedOutDir ? [] : ["--out-dir", "dist"];

const copyFiles = args.includes("--no-copy-files") ? [] : ["--copy-files"];

const useBuiltinConfig =
	!args.includes("--presets") && !hasFile(".babelrc") && !hasPkgProp("babel");
const config = useBuiltinConfig
	? ["--presets", here("../../config/babel-preset.js")]
	: [];

const verbosity = args.includes("--quiet") ? [] : ["--verbose"];

const ignore = args.includes("--ignore") ? [] : ["--ignore", "**/*.test.js"];

const result = spawn.sync(
	"node",
	[
		resolveBin("@babel/cli", { executable: "babel" }),
		...outDir,
		...copyFiles,
		...ignore,
		...verbosity,
		...config,
		"src",
	].concat(args),
	{ stdio: "inherit" },
);

if (result.status !== 0) {
	console.error("Babel finished with non-zero exit code", result.status);
}
process.exit(result.status);
