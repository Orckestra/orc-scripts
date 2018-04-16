import "raf/polyfill";

if (typeof document === "undefined") {
	const JSDOM = require("jsdom").JSDOM;
	const dom = new JSDOM("");
	global.window = dom.window;

	for (let key in global.window) {
		if (!global[key]) {
			global[key] = global.window[key];
		}
	}
}
