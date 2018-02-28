const unexpected = require("unexpected");
const unexpectedReact = require("unexpected-react");

global.expect = unexpected.clone().use(unexpectedReact);
