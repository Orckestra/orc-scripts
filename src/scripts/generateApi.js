const fs = require("fs");
const https = require("https");
const lodash = require("lodash");

const occUrl = process.env.OccUrl;
const occToken = process.env.OccToken;
let outputFile = "";

if (process.argv.includes("--outputFile")) {
	outputFile = process.argv[process.argv.indexOf("--outputFile") + 1];
}

if (!outputFile) {
	throw new Error("Missing --outputFile 'file' argument.");
}

if (!occToken) {
	throw new Error(
		"Missing OccToken environment variable. This environment variable needs to contains the authentication token used to access the OCC platform specified in OccUrl.",
	);
}

if (!occUrl) {
	throw new Error(
		"Missing OccUrl environment variable. This environment variable needs to contains the URL of the OCC platform which contains the OpenAPI metadata.",
	);
}

function uncapitalizeFirstLetter(s) {
	return s.charAt(0).toLowerCase() + s.slice(1);
}

function extractRequestNameFromOperation(operation) {
	const rx = /.*{(?<name>[^{}]*)}$/;
	return uncapitalizeFirstLetter(operation.summary.match(rx).groups["name"]);
}

function isVerbAllowed(verb) {
	const lowerCaseVerb = verb.toLowerCase();
	return lowerCaseVerb === "get" || lowerCaseVerb === "post" || lowerCaseVerb === "put" || lowerCaseVerb === "delete";
}

function generateOperationsFromPath(url, pathData) {
	const operations = [];

	for (const verb of Object.getOwnPropertyNames(pathData)) {
		if (!isVerbAllowed(verb)) {
			continue;
		}

		const operation = pathData[verb];

		operations.push({
			name: extractRequestNameFromOperation(operation),
			url: url,
			verb: verb.toUpperCase(),
			hasQueryString: operation.parameters.filter(p => p.in === "query").length > 0,
		});
	}

	return operations;
}

function generateOperation(operation) {
	// trim '/' from start/end and split on the '/' character. We do this to avoid having an empty element in the array
	const urlSegments = lodash.trim(operation.url, "/").split("/");
	const parameters = [];
	const buildUrlParams = [];

	// An OCC URL has the following format: /customers/{ScopeId}/{CustomerId}/orders
	// The code below extract the tokens between curly braces and generates the parameters for the buildUrl method

	for (const segment of urlSegments) {
		if (segment.startsWith("{")) {
			const cleanName = uncapitalizeFirstLetter(segment.match(/{(?<name>[^{}]*)}/).groups["name"]);
			parameters.push(cleanName);
			buildUrlParams.push(cleanName);
		} else {
			buildUrlParams.push(`"${segment}"`);
		}
	}

	let buildUrlParamsStr = `[${buildUrlParams.join(", ")}]`;

	if (operation.hasQueryString) {
		parameters.push("queryParams");
		buildUrlParamsStr += ", queryParams";
	}

	return `export const ${operation.name} = {
\tname: '${operation.name}',
\tbuildUrl: (${parameters.join(", ")}) => buildUrl(${buildUrlParamsStr}),
\tverb: '${operation.verb}'
}\n\n`;
}

function generateImports() {
	if (fs.existsSync("node_modules/orc-shared")) {
		return 'import { buildUrl } from "orc-shared/src/utils/buildUrl";\n\n';
	}

	return 'import { buildUrl } from "../utils/buildUrl";\n\n';
}

https
	.get(occUrl, { headers: { "X-AUTH": occToken } }, resp => {
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
			const swaggerMetaData = JSON.parse(data);
			const paths = swaggerMetaData.paths;
			let operations = [];

			for (const url of Object.getOwnPropertyNames(paths)) {
				operations = operations.concat(generateOperationsFromPath(url, paths[url]));
			}

			let helperData = "/* istanbul ignore file */\n\n";
			helperData += generateImports();

			for (const op of lodash.sortBy(operations, [o => o.name])) {
				helperData += generateOperation(op);
			}

			fs.writeFile(outputFile, helperData, function (err) {
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
