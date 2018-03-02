const unexpected = require("unexpected");
const unexpectedReact = require("unexpected-react");
const unexpectedSinon = require("unexpected-sinon");

global.expect = unexpected
	.clone()
	.use(unexpectedReact)
	.use(unexpectedSinon);
