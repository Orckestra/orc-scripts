const util = require("util");
const path = require("path");
const makeDir = require("make-dir");

const readdir = util.promisify(require("fs").readdir);
const copyFile = util.promisify(require("ncp").ncp);

const distDir = path.resolve(process.cwd(), "dist");
const contentDir = path.resolve(process.cwd(), "src/content");
const staticDir = path.resolve(process.cwd(), "src/static");

makeDir("dist")
	.then(() =>
		copyFile(contentDir, path.resolve(distDir, "content")).catch(() => {}),
	)
	.then(() => {
		// If production, don't copy static files
		if (process.env.NODE_ENV === "production") process.exit(0);
	})
	.then(() =>
		readdir(staticDir)
			.then(files =>
				Promise.all(
					files.map(file =>
						copyFile(
							path.resolve(staticDir, file),
							path.resolve(distDir, file),
						),
					),
				),
			)
			.catch(() => {}),
	);
