process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";

const { hasPkgProp, parseEnv, hasFile } = require("../utils");

const args = process.argv.slice(2);

const isCI = require("is-ci") || args.includes("--ci");

const watch =
	!isCI &&
	!parseEnv("SCRIPTS_PRECOMMIT", false) &&
	!args.includes("--no-watch") &&
	!args.includes("--coverage") &&
	!args.includes("--updateSnapshot")
		? ["--watch"]
		: [];

const ci = isCI ? ["--reporters=default", "--reporters=jest-junit"] : [];

const config =
	!args.includes("--config") && !hasFile("jest.config.js") && !hasPkgProp("jest")
		? ["--config", JSON.stringify(require("../config/jest.config"))]
		: [];

require("jest").run([...config, ...watch, ...ci, ...args]);
