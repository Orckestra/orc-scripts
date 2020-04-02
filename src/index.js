#!/usr/bin/env node

require("dotenv").config();

global.amOrcScripts = /orc-scripts$/.test(require("pkg-dir").sync() || "");

let shouldThrow;
try {
	shouldThrow =
		global.amOrcScripts && Number(process.version.slice(1).split(".")[0]) < 10;
} catch (error) {
	// ignore
}

if (shouldThrow) {
	const msg =
		"You must use Node version 10 or greater to run the scripts within orc-scripts " +
		"because we dogfood the untranspiled version of the scripts.";
	throw new Error(msg);
}

require("./run-script");
