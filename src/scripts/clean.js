const path = require("path");
const rimraf = require("rimraf");
rimraf(path.resolve(process.cwd(), "dist"), err => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
