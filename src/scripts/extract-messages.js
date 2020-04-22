const path = require("path");
const pkgConf = require("pkg-conf");
const extractReactIntlMessages = require("extract-react-intl-messages");

pkgConf("locales").then(rawLocales => {
	const locales = Object.values(rawLocales);

	if (!locales.length) {
		console.error("Current project has no specified locales");
		process.exit(-1);
	}

	const cultureIsos = locales.map(l => l.cultureIso);

	console.log("Extracting react-intl messages for", cultureIsos.join(", "));
	console.log("Default locale is", cultureIsos[0]);

	const baseDir = path.resolve(process.cwd(), "src");
	const input = path.join(baseDir, "**", "!(*.test).js");
	const buildDir = path.resolve(baseDir, "translations");

	extractReactIntlMessages(cultureIsos, input, buildDir, {
		defaultLocale: cultureIsos[0],
	});
});
