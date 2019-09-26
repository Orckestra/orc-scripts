const util = require("util");
const path = require("path");
const makeDir = require("make-dir");
const rimraf = require("rimraf");
const copyFile = util.promisify(require("ncp").ncp);
const spawn = require("cross-spawn");

let repos;
const gitMatch = /^(git@github\.com:|https:\/\/)/;
repos = process.argv.find(element => gitMatch.test(element));
if (!repos) {
	console.error("No target repository given");
	process.exit(-1);
}

async function build(repos) {
	const name = repos.match(/([^/]*)\.git$/)[1];
	const folder = path.resolve(process.cwd(), "builds/" + name);
	let pack;

	console.log(`Building ${name} from repository ${repos}
		in ${folder}`);

	const buildResult = spawn.sync("npm", ["run", "build"]);
	if (buildResult.status !== 0) {
		console.error(buildResult.stderr.toString("utf-8"));
		return -1;
	}
	const packResult = spawn.sync("npm", ["pack"]);
	if (packResult.status !== 0) {
		console.error(packResult.stderr.toString("utf-8"));
		return -1;
	}
	const packName = packResult.stdout.toString("utf-8").trim();
	console.log("Packaged to " + packName);

	try {
		rimraf.sync(folder);
	} catch (err) {
		console.error(err.message);
		return -1;
	}

	try {
		await makeDir("builds");
	} catch (_) {}

	const gitResult = spawn.sync("git", ["clone", repos, folder]);
	if (gitResult.status !== 0) {
		console.error(gitResult.stderr.toString("utf-8"));
		return -1;
	}
	console.log("Git repository was cloned");

	try {
		await copyFile(
			path.resolve(folder, ".env.example"),
			path.resolve(folder, ".env"),
		);
	} catch (err) {
		console.error(err.message);
		return -1;
	}

	const installResult = spawn.sync("npm", ["install"], { cwd: folder });
	if (installResult.status !== 0) {
		console.error(installResult.stderr.toString("utf-8"));
		return -1;
	}
	console.log("Dependencies installed");

	pack = path.resolve(process.cwd(), packName);
	const packInstallResult = spawn.sync("npm", ["install", pack], {
		cwd: folder,
	});
	if (packInstallResult.status !== 0) {
		console.error(packInstallResult.stderr.toString("utf-8"));
		return -1;
	}
	console.log("Package installed");

	const testResult = spawn.sync("npm", ["test", "--", "--no-watch"], {
		cwd: folder,
		stdio: "inherit",
	});
	if (testResult.status !== 0) {
		return -1;
	}

	console.log("Tests passed");
	if (pack) rimraf.sync(pack);
	return 0;
}

build(repos).then(returnCode => {
	if (returnCode) {
		console.log("Errors occurred.");
	}
	process.exit(returnCode);
});