const path = require("path");
const readPkgUp = require("read-pkg-up");
const extractReactIntlMessages = require("extract-react-intl-messages");

const { packageJson } = readPkgUp.sync({ normalize: false }) || {};
const locales = packageJson.locales.map(l => l.cultureIso);

if (!locales.length) {
	console.error("Current project has no specified locales");
	process.exit(-1);
}

console.log("Extracting react-intl messages for", locales.join(", "));
console.log("Default locale is", locales[0]);

const baseDir = path.resolve(process.cwd(), "src");
const input = path.join(baseDir, "**", "!(*.test).js");
const buildDir = path.resolve(baseDir, "translations");

extractReactIntlMessages(locales, input, buildDir, {
	defaultLocale: locales[0],
});
