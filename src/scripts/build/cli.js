const path = require("path");
const { resolveBin } = require("../../utils");

const spawn = require("cross-spawn");

const args = process.argv.slice(2);

const outDir = ["--out-dir", "dist"];

const copyFiles = args.includes("--no-copy-files") ? [] : ["--copy-files"];

const ignore = ["--ignore", ".test.js"];

const babelConfig = require("../../config/babelrc.js");
const fs = require("fs");
const tempConfPath = path.resolve(process.cwd(), "babel.tmp.json");
fs.writeFileSync(tempConfPath, JSON.stringify(babelConfig));

const config = ["--presets", tempConfPath];

const result = spawn.sync(
	resolveBin("babel-cli", { executable: "babel" }),
	[...outDir, ...copyFiles, ...ignore, ...config, "src"].concat(args),
	{ stdio: "inherit" },
);

fs.unlinkSync(tempConfPath);

if (result.status !== 0) {
	console.error("Babel finished with non-zero exit code", result.status);
}
process.exit(result.status);
