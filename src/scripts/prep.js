const util = require("util");
const path = require("path");
const makeDir = require("make-dir");

const readdir = util.promisify(require("fs").readdir);
const copyFile = util.promisify(require("ncp").ncp);
const existsSync = require("fs").existsSync;
const stat = util.promisify(require("fs").stat);

const distDir = path.resolve(process.cwd(), "dist");
const contentDir = path.resolve(process.cwd(), "src/content");
const staticDir = path.resolve(process.cwd(), "src/static");
const mockDir = path.resolve(process.cwd(), "src/__mocks__");
const projectSpecificPrep = path.resolve(process.cwd(), "src/project-prep.json");

async function prep() {
	await makeDir("dist");
	try {
		await Promise.all([
			copyFile(contentDir, path.resolve(distDir, "content")),
			copyFile(mockDir, path.resolve(distDir, "__mocks__")),
		]);
	} catch (_) {}

	if (process.env.NODE_ENV === "production") {
		// production build will not copy the static files
	} else {
		try {
			const files = await readdir(staticDir);
			await Promise.all(files.map(file => copyFile(path.resolve(staticDir, file), path.resolve(distDir, file))));
		} catch (_) {}
	}

	if (existsSync(projectSpecificPrep)) {
		const additionalFiles = require(projectSpecificPrep);

		if (additionalFiles && additionalFiles.length > 0) {
			additionalFiles.forEach(async fileInfo => {
				const sourceFile = path.resolve(process.cwd(), fileInfo.src);
				const fileStat = await stat(sourceFile);

				if (fileStat.isDirectory()) {
					const files = await readdir(sourceFile);
					await makeDir(path.resolve(distDir, fileInfo.dest));
					await Promise.all(
						files.map(file => copyFile(path.resolve(sourceFile, file), path.resolve(distDir, fileInfo.dest, file))),
					);
				} else {
					const destFile = path.resolve(distDir, fileInfo.dest, path.basename(fileInfo.src));
					const destDir = path.dirname(destFile);
					await makeDir(destDir);
					await copyFile(sourceFile, destFile);
				}
			});
		}
	} else {
		console.log("nay");
	}
}

prep();
