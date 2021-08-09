const path = require("path");
const util = require("util");
const fs = require("fs");
const lodash = require("lodash");

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const appTranslationsDir = path.resolve(process.cwd(), "src/translations");
const translations = {};
const filesToValidate = [];
const args = process.argv.slice(2);

if (args.length > 0) {
	for (const arg of args) {
		filesToValidate.push(path.basename(arg.replace("'", "").replace('"', "")).toLowerCase());
	}
}

async function validate() {
	let exitCode = 0;
	const files = await readdir(appTranslationsDir);

	for (const file of files) {
		if (!file.endsWith(".json")) {
			continue;
		}

		const appLocalizationFile = path.resolve(appTranslationsDir, file);
		const appData = await readFile(appLocalizationFile, "utf8");

		const appLocalizations = JSON.parse(appData);
		translations[file.toLowerCase()] = Object.keys(appLocalizations);
	}

	for (const language of Object.keys(translations)) {
		const languageKeys = translations[language];

		if (filesToValidate.length > 0 && !filesToValidate.includes(language)) {
			continue;
		}

		for (const otherLanguage of Object.keys(translations).filter(x => x !== language)) {
			const otherLanguageKeys = translations[otherLanguage];
			const additionalTranslations = lodash.without(languageKeys, ...otherLanguageKeys);

			if (additionalTranslations.length > 0) {
				exitCode = -1;
				console.warn(
					"Validation exception found when comparing language " +
						language +
						" to " +
						otherLanguage +
						". Language " +
						language +
						" has the following additional translations:",
				);
				console.warn(additionalTranslations);
				console.warn("");
			}
		}
	}

	return exitCode;
}

validate().then(returnCode => {
	if (returnCode) {
		console.log("Validation failed.");
	}
	process.exit(returnCode);
});
