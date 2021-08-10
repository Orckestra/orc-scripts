const util = require("util");
const path = require("path");
const makeDir = require("make-dir");

const readdir = util.promisify(require("fs").readdir);
const copyFile = util.promisify(require("ncp").ncp);

const distDir = path.resolve(process.cwd(), "dist");
const contentDir = path.resolve(process.cwd(), "src/content");
const staticDir = path.resolve(process.cwd(), "src/static");
const mockDir = path.resolve(process.cwd(), "src/__mocks__");

async function prep() {
	await makeDir("dist");
	try {
		await Promise.all([
			copyFile(contentDir, path.resolve(distDir, "content")),
			copyFile(mockDir, path.resolve(distDir, "__mocks__")),
		]);
	} catch (_) {}
	if (process.env.NODE_ENV === "production") process.exit(0);
	try {
		const files = await readdir(staticDir);
		await Promise.all(files.map(file => copyFile(path.resolve(staticDir, file), path.resolve(distDir, file))));
	} catch (_) {}
}

prep();
