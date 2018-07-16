const unexpected = require("unexpected");
const unexpectedReact = require("unexpected-react");
const unexpectedStyled = require("./unexpected-styled");
const unexpectedSinon = require("unexpected-sinon");
const unexpectedImmutable = require("unexpected-immutable");
const Immutable = require("immutable");

global.expect = unexpected
	.clone()
	.use(unexpectedReact)
	.use(unexpectedStyled)
	.use(unexpectedSinon)
	.use(unexpectedImmutable)
	.addAssertion(
		"<function> to be a reducer with initial state <object>",
		function(expect, subject, initialState) {
			expect.errorMode = "nested";
			const oldState = Immutable.Map();
			return expect(
				subject,
				"when called with",
				[oldState, { type: "NOT_A_USEFUL_ACTION" }],
				"to be",
				oldState,
			).and(
				"when called with",
				[undefined, { type: "@@INIT" }],
				"to equal",
				Immutable.fromJS(initialState),
			);
		},
	)
	.addAssertion("<ReactShallowRenderer> has elements <assertion?>", function(
		expect,
		subject,
	) {
		expect.errorMode = "nested";
		const elements = subject.getRenderOutput();
		expect.shift(elements);
	})
	.addAssertion("<ReactElement> renders elements <assertion?>", function(
		expect,
		subject,
		...assertions
	) {
		return expect(subject, "when rendered", "has elements", ...assertions);
	});
