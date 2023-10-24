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

const isVersionBranch = currentBranch.startsWith("version/");

if (!isVersionBranch) {
	console.error("Tagging is only supported on a version/X.Y branch");
	process.exit(2);
}

const { packageJson } = readPkgUp.sync({ normalize: false }) || {};
const currentVersion = packageJson.version;

const tag = inc(currentVersion, "prerelease", "dev");

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
