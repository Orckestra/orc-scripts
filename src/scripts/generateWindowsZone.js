const fs = require("fs");
const https = require("https");
const jsdom = require("jsdom");

let outputFile = "";
let windowsZonesUrl = "";

if (process.argv.includes("--outputFile")) {
	outputFile = process.argv[process.argv.indexOf("--outputFile") + 1];
}

if (!outputFile) {
	throw new Error("Missing --outputFile 'file' argument.");
}

if (process.argv.includes("--windowsZonesUrl")) {
	windowsZonesUrl = process.argv[process.argv.indexOf("--windowsZonesUrl") + 1];
} else {
	windowsZonesUrl =
		"https://raw.githubusercontent.com/unicode-org/cldr/refs/heads/main/common/supplemental/windowsZones.xml";
}

downloadUrl();

function extractTimeZones(timeZones) {
	const result = {
		ianaToWindows: {},
		windowsToIana: {},
	};

	const dom = new jsdom.JSDOM(timeZones);
	const parser = new dom.window.DOMParser();

	const xmlDoc = parser.parseFromString(timeZones, "application/xml");
	const mapZones = xmlDoc.getElementsByTagName("mapZone");

	for (let zone of mapZones) {
		const key = zone.getAttribute("other");
		const type = zone.getAttribute("type");

		if (!result.windowsToIana[key]) {
			result.windowsToIana[key] = [];
		}

		const types = type.split(" ");

		for (let t of types) {
			if (!result.windowsToIana[key].includes(t)) {
				result.windowsToIana[key].push(t);
			}

			if (!result.ianaToWindows[t]) {
				result.ianaToWindows[t] = [];
			}

			if (!result.ianaToWindows[t].includes(key)) {
				result.ianaToWindows[t].push(key);
			}
		}
	}

	return result;
}

function downloadUrl() {
	https
		.get(windowsZonesUrl, {}, resp => {
			let data = "";
			let error = "";

			if (resp.statusCode !== 200) {
				error = new Error(`Request Failed. Status Code: ${resp.statusCode}`);
			}
			if (error) {
				console.error(error.message);
				// Consume response data to free up memory
				resp.resume();
				return;
			}

			// A chunk of data has been received.
			resp.on("data", chunk => {
				data += chunk;
			});

			// The whole response has been received. Print out the result.
			resp.on("end", () => {
				const result = extractTimeZones(data);

				fs.writeFile(outputFile, JSON.stringify(result, null, 2), function (err) {
					if (err) {
						return console.error(err);
					}
					console.log(`File '${outputFile}' has been created`);
				});
			});
		})
		.on("error", err => {
			console.log("Error: " + err.message);
		});
}
