const fs = require("fs");
const https = require("https");
const jsdom = require("jsdom");

let outputFile = "";
let windowsZonesUrl = "";

console.log(process.argv);

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
		IANA: {},
		WindowsZone: {},
	};

	const dom = new jsdom.JSDOM(timeZones);
	const parser = new dom.window.DOMParser();

	const xmlDoc = parser.parseFromString(timeZones, "application/xml");
	const mapZones = xmlDoc.getElementsByTagName("mapZone");

	for (let zone of mapZones) {
		const key = zone.getAttribute("other");
		const type = zone.getAttribute("type");

		if (!result.IANA[key]) {
			result.IANA[key] = [];
		}

		const types = type.split(" ");

		for (let t of types) {
			if (!result.IANA[key].includes(t)) {
				result.IANA[key].push(t);
			}

			if (!result.WindowsZone[t]) {
				result.WindowsZone[t] = [];
			}

			if (!result.WindowsZone[t].includes(key)) {
				result.WindowsZone[t].push(key);
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
