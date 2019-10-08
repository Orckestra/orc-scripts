const util = require("util");
const path = require("path");
const makeDir = require("make-dir");

const readdir = util.promisify(require("fs").readdir);
const copyFile = util.promisify(require("ncp").ncp);

const distDir = path.resolve(process.cwd(), "dist");
const contentDir = path.resolve(process.cwd(), "src/content");
const staticDir = path.resolve(process.cwd(), "src/static");

async function prep() {
	await makeDir("dist");
	try {
		await copyFile(contentDir, path.resolve(distDir, "content"));
	} catch (_) {}
	if (process.env.NODE_ENV === "production") process.exit(0);
	try {
		const files = await readdir(staticDir);
		await Promise.all(
			files.map(file =>
				copyFile(path.resolve(staticDir, file), path.resolve(distDir, file)),
			),
		);
	} catch (_) {}
}

prep();
