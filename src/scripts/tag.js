const fs = require("fs");
const spawn = require("cross-spawn");
const readPkgUp = require("read-pkg-up");
const { inc, prerelease } = require("semver");

const gitResult = spawn.sync("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
if (gitResult.status !== 0) {
	console.error(gitResult.stderr.toString("utf-8"));
	process.exit(-1);
}
const currentBranch = gitResult.stdout.toString("utf-8").trim();

const isMaster = currentBranch === "master";
const isDevelopment = currentBranch === "develop";
const isRelease = currentBranch.startsWith("release/");
const isLegacy = currentBranch.startsWith("legacy/");

const { packageJson } =
	readPkgUp.sync({
		cwd: fs.realpathSync(process.cwd()),
	}) || {};
const currentVersion = packageJson.version;
let tag = "";
if (isMaster) {
	// TODO: Should this happen here?
	// semver increment major/minor/patch
} else if (isRelease) {
	const pre = prerelease(currentVersion);
	if (pre && pre.length === 0 && pre[0] !== "pre") {
		tag = inc(currentVersion, "prerelease", "pre");
	} else {
		const versionLevels = ["premajor", "preminor", "prepatch"];
		const branchVersion = currentBranch.replace(/^.*\/v/, "").split(".");
		tag = inc(currentVersion, versionLevels[branchVersion.length - 1], "pre");
	}
} else if (isLegacy) {
	const versionLevels = ["major", "minor", "patch"];
	const branchVersion = currentBranch.replace(/^.*\/v/, "").split(".");
	tag = inc(currentVersion, versionLevels[branchVersion.length]) + "+legacy";
} else if (isDevelopment || true) {
	tag = inc(currentVersion, "prerelease", "dev");
}
console.log("npm version", tag);

const tagResult = spawn.sync("npm", ["version", tag], {
	stdio: "inherit",
});
if (tagResult.status !== 0) {
	process.exit(1);
}
