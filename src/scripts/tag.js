const spawn = require("cross-spawn");
const readPkgUp = require("read-pkg-up");
const { inc, prerelease } = require("semver");

const gitDiffResult = spawn.sync("git", ["diff", "HEAD"]);
if (gitDiffResult.status !== 0 || gitDiffResult.stdout.toString("utf-8")) {
	console.error("Working directory not clean, cannot tag release");
	process.exit(-1);
}

const gitBranchResult = spawn.sync("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
if (gitBranchResult.status !== 0) {
	console.error(gitBranchResult.stderr.toString("utf-8"));
	process.exit(-2);
}
const currentBranch = gitBranchResult.stdout.toString("utf-8").trim();

const isMaster = currentBranch === "master";
const isDevelopment = currentBranch === "develop" || currentBranch.startsWith("feature/");
const isRelease = currentBranch.startsWith("release/");
const isLegacy = currentBranch.startsWith("legacy/");

const { packageJson } = readPkgUp.sync({ normalize: false }) || {};
const currentVersion = packageJson.version;
let tag = "";
if (isMaster) {
	// TODO: Should semver increment major/minor/patch - but which is hard to discover
	// Fail out and tag manually for now
	console.error(
		"Tags from master branch should be made manually with the npm version command",
	);
	process.exit(2);
} else if (isRelease) {
	const pre = prerelease(currentVersion);
	if (pre) {
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
} else if (isDevelopment) {
	tag = inc(currentVersion, "prerelease", "dev");
}

const gitTagcheckResult = spawn.sync("git", ["rev-parse", tag]);
// Failure == no tag == go ahead
if (gitTagcheckResult.status === 0) {
	console.error("Tag", tag, "already exists, tagging aborted");
	process.exit(-3);
}

const tagResult = spawn.sync("npm", ["version", tag], {
	stdio: "inherit",
});
if (tagResult.status !== 0) {
	process.exit(1);
}
