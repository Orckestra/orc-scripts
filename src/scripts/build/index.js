const { parseEnv } = require("../../utils");

const isWebpack = parseEnv("BUILD_WEBPACK", false);

if (isWebpack) {
	require("./web");
} else {
	require("./cli");
}
