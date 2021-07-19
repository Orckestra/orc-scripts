const spawn = require("cross-spawn");
const readPkgUp = require("read-pkg-up");
const { inc, lt, eq, coerce, prerelease } = require("semver");

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
const isDevelopment = currentBranch === "develop";
const isRelease = currentBranch.startsWith("releases/");
const isLegacy = currentBranch.startsWith("legacy/");

const { packageJson } = readPkgUp.sync({ normalize: false }) || {};
const currentVersion = packageJson.version;
let tag = "";
if (isMaster) {
	// TODO: Should semver increment major/minor/patch - but which is hard to discover
	// Fail out and tag manually for now
	console.error("Tags from master branch should be made manually with the npm version command");
	process.exit(2);
} else if (isRelease) {
	const pre = prerelease(currentVersion);
	const branchVersion = coerce(currentBranch.replace(/^.*\//, "")).version;
	if (lt(branchVersion, currentVersion)) {
		// Branch version must be greater or equal
		console.error("Branch version must be higher than or equal to package version");
		process.exit(3);
	}
	if (pre && eq(branchVersion, currentVersion.replace(/-.*$/, ""))) {
		tag = inc(currentVersion, "prerelease", "pre");
	} else {
		// First pre-release needs specific handling
		// see https://www.npmjs.com/package/semver#functions,
		// the inc() function regarding the semantics of "prerelease"
		tag = branchVersion + "-pre.0";
	}
} else if (isLegacy) {
	// Only patch updates
	tag = inc(currentVersion, "patch") + "+legacy";
} else if (isDevelopment) {
	const pre = prerelease(currentVersion);
	if (pre && pre[0] !== "dev") {
		tag = inc(currentVersion, "prepatch", "dev");
	} else {
		tag = inc(currentVersion, "prerelease", "dev");
	}
}

if (!tag) {
	console.error("This branch (" + currentBranch + ") cannot have releases tagged from it.");
	process.exit(4);
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
