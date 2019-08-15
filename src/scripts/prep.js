const util = require("util");
const fs = require("fs");
const path = require("path");
const makeDir = require("make-dir");

const readdir = util.promisify(fs.readdir);
const copyFile = util.promisify(fs.copyFile);

const distDir = path.resolve(process.cwd(), "dist");
const contentDir = path.resolve(process.cwd(), "src/content");
const staticDir = path.resolve(process.cwd(), "src/static");

makeDir("dist").then(() =>
	readdir(contentDir)
		.then(files =>
			makeDir("dist/content").then(
				Promise.all(
					files.map(file =>
						copyFile(
							path.resolve(contentDir, file),
							path.resolve(distDir, "content", file),
						),
					),
				),
			),
		)
		.then(() => {
			// If production, don't copy static files
			if (process.env.NODE_ENV === "production") process.exit(0);
		})
		.then(() =>
			readdir(staticDir).then(files =>
				Promise.all(
					files.map(file =>
						copyFile(
							path.resolve(staticDir, file),
							path.resolve(distDir, file),
						),
					),
				),
			),
		),
);
