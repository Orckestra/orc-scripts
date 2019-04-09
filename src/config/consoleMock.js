const sinon = require("sinon");

const spyNames = ["log", "warn", "error"];
let spiedFuncs;
beforeEach(() => {
	spiedFuncs = spyNames.map(funcName => {
		const func = sinon.spy().named("console." + funcName);
		const oldFunc = console[funcName];
		console[funcName] = func;
		return oldFunc;
	});
});
afterEach(() => {
	spiedFuncs.forEach((func, index) => {
		const name = spyNames[index];
		console[name] = func;
	});
});
