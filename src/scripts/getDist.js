const readPkgUp = require("read-pkg-up");
const { prerelease } = require("semver");

const { packageJson } = readPkgUp.sync({ normalize: false }) || {};
const currentVersion = packageJson.version;
const pre = prerelease(currentVersion);

if (pre && pre[0] === "pre") {
	console.log("beta");
} else if (pre && pre[0] === "dev") {
	console.log("dev");
} else if (currentVersion.endsWith("+legacy")) {
	console.log("previous");
} else if (/^\d+\.\d+\.\d+$/.test(currentVersion)) {
	console.log("latest");
} else {
	// This is not right?
	console.log("trash");
	console.error("Version number ", currentVersion, "does not comply with expectations");
}
