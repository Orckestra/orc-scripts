// @flow
const path = require("path");
const { resolveBin } = require("../../utils");

const here = p => path.join(__dirname, p);

const spawn = require("cross-spawn");

const args = process.argv.slice(2);

const outDir = ["--out-dir", "dist"];

const copyFiles = args.includes("--no-copy-files") ? [] : ["--copy-files"];

const config = ["--presets", here("../../config/babelrc.js")];

const ignore = ["--ignore", ".test.js"];

const result = spawn.sync(
	resolveBin("babel-cli", { executable: "babel" }),
	[...outDir, ...copyFiles, ...ignore, ...config, "src"].concat(args),
	{ stdio: "inherit" },
);

process.exit(result.status);
