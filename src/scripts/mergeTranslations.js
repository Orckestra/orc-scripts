const path = require("path");
const util = require("util");
const fs = require("fs");

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const appTranslationsDir = path.resolve(process.cwd(), "src/translations");
const orcSharedTranslationsDir = path.resolve(process.cwd(), "node_modules/orc-shared/src/translations");

readdir(appTranslationsDir, (_, files) => {
	files.forEach(file => {
		if (!file.endsWith(".json")) {
			return;
		}

		const appLocalizationFile = path.resolve(appTranslationsDir, file);
		const correspondingOrcSharedFile = path.resolve(orcSharedTranslationsDir, file);

		readFile(correspondingOrcSharedFile, "utf8", (_, orcSharedData) => {
			const orcSharedLocalizations = JSON.parse(orcSharedData);

			readFile(appLocalizationFile, "utf8", (_, appData) => {
				const appLocalizations = JSON.parse(appData);
				const mergedData = { ...appLocalizations, ...orcSharedLocalizations };
				const stringifiedData = JSON.stringify(mergedData, null, 1);
				writeFile(appLocalizationFile, stringifiedData, "utf8");
				writeFile(appLocalizationFile, "\r\n", "utf8");
			});
		});
	});
});
