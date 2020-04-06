const path = require("path");
const spawn = require("cross-spawn");
const glob = require("glob");

const [, , script, ...args] = process.argv;
const executor = global.amOrcScripts ? "node" : process.argv[0];

if (script) {
	spawnScript();
} else {
	const scriptsPath = path.join(__dirname, "scripts/");
	const scriptsAvailable = glob.sync(path.join(__dirname, "scripts", "*"));
	// `glob.sync` returns paths with unix style path separators even on Windows.
	// So we normalize it before attempting to strip out the scripts path.
	const scriptsAvailableMessage = scriptsAvailable
		.map(path.normalize)
		.map(s =>
			s
				.replace(scriptsPath, "")
				.replace(/__tests__/, "")
				.replace(/\.js$/, ""),
		)
		.filter(Boolean)
		.join("\n  ")
		.trim();
	const fullMessage = `
Usage: orc-scripts [script] [parameters]
Available Scripts:
  ${scriptsAvailableMessage}
Parameters:
  All parameters depend on the script. See documentation in orc-scripts/docs.
  `.trim();
	console.log(`\n${fullMessage}\n`);
}

function getEnv() {
	// this is required to address an issue in cross-spawn
	// https://github.com/kentcdodds/kcd-scripts/issues/4
	return Object.keys(process.env)
		.filter(key => process.env[key] !== undefined)
		.reduce(
			(envCopy, key) => {
				envCopy[key] = process.env[key];
				return envCopy;
			},
			{
				[`SCRIPTS_${script.toUpperCase()}`]: true,
			},
		);
}

function spawnScript() {
	const relativeScriptPath = path.join(__dirname, "./scripts", script);
	const scriptPath = attemptResolve(relativeScriptPath);

	if (!scriptPath) {
		throw new Error(`Unknown script "${script}".`);
	}
	const nodeArgs = [
		"--preserve-symlinks",
		"--preserve-symlinks-main",
		"--icu-data-dir=node_modules\\full-icu",
	];
	const result = spawn.sync(executor, [...nodeArgs, scriptPath, ...args], {
		stdio: "inherit",
		env: getEnv(),
	});

	if (result.signal) {
		handleSignal(result);
	} else {
		process.exit(result.status);
	}
}

function attemptResolve(...resolveArgs) {
	try {
		return require.resolve(...resolveArgs);
	} catch (error) {
		return null;
	}
}

function handleSignal(result) {
	if (result.signal === "SIGKILL") {
		console.log(
			`The script "${script}" failed because the process exited too early. ` +
				"This probably means the system ran out of memory or someone called " +
				"`kill -9` on the process.",
		);
	} else if (result.signal === "SIGTERM") {
		console.log(
			`The script "${script}" failed because the process exited too early. ` +
				"Someone might have called `kill` or `killall`, or the system could " +
				"be shutting down.",
		);
	}
	process.exit(1);
}
