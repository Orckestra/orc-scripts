const path = require("path");
const pkgConf = require("pkg-conf");
const extractReactIntlMessages = require("extract-react-intl-messages");

const locales = Object.values(pkgConf.sync("locales"));

if (!locales.length) {
	console.error("Current project has no specified locales");
	process.exit(-1);
}

console.log("Extracting react-intl messages for", locales.join(", "));

const baseDir = path.resolve(process.cwd(), "src");
const input = path.join(baseDir, "**", "*.js");
const buildDir = path.resolve(baseDir, "translations");

extractReactIntlMessages(locales, input, buildDir);
