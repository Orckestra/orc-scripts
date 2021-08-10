const path = require("path");
const { hasPkgProp, resolveBin, hasFile } = require("../../utils");
const spawn = require("cross-spawn");

const here = p => path.join(__dirname, p);

const args = process.argv.slice(2);

const useSpecifiedOutDir = args.includes("--out-dir");
const outDir = useSpecifiedOutDir ? [] : ["--out-dir", "dist"];

const copyFiles = args.includes("--no-copy-files") ? [] : ["--copy-files"];

const useBuiltinConfig =
	!args.includes("--presets") && (!hasFile(".babelrc") || !hasFile("babel.config.js")) && !hasPkgProp("babel");
const config = useBuiltinConfig ? ["--presets", here("../../config/babel-preset.js")] : [];

const verbosity = args.includes("--quiet") ? [] : ["--verbose"];

const ignore = args.includes("--ignore") ? [] : ["--ignore", "**/*.test.js,**/__mocks__"];

const babelUnacceptedArgs = ["--no-copy-files"];

const filteredArgs = args.filter(arg => !babelUnacceptedArgs.includes(arg));

const child = spawn(
	resolveBin("@babel/cli", { executable: "babel" }),
	[...outDir, ...copyFiles, ...ignore, ...verbosity, ...config, "src"].concat(filteredArgs),
	{ stdio: "inherit" },
);

child.on("error", err => {
	console.error("An error occurred:");
	console.error(err);
	process.exit(-1);
});

child.on("exit", exitCode => {
	if (exitCode !== 0) {
		console.error("Babel finished with non-zero exit code", exitCode);
	}
	process.exit(exitCode);
});
