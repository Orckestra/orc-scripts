const unexpected = require("unexpected");
const unexpectedDom = require("unexpected-dom");
const unexpectedReaction = require("unexpected-reaction");
const unexpectedSinon = require("unexpected-sinon");
const unexpectedImmutable = require("unexpected-immutable");
const unexpectedStyles = require("./unexpected-styles");
const unexpectedModule = require("./unexpected-module");
const unexpectedForm = require("./unexpected-form");
const React = require("react");
const Immutable = require("immutable");
const sinon = require("sinon");

global.expect = unexpected
	.clone()
	.use(unexpectedSinon)
	.use(unexpectedImmutable)
	.use(unexpectedDom)
	.use(unexpectedReaction)
	.use(unexpectedStyles)
	.use(unexpectedModule)
	.use(unexpectedForm)
	.addAssertion(
		"<array-like> to be shorter than [or same length as] <array-like>",
		function (expect, subject, pattern) {
			if (expect.flags["or same length as"]) {
				return expect(subject.length, "to be less than or equal to", pattern.length);
			} else {
				return expect(subject.length, "to be less than", pattern.length);
			}
		},
	)
	.addAssertion("<function> to be a reducer with initial state <object>", function (expect, subject, initialState) {
		expect.errorMode = "nested";
		const oldState = Immutable.Map();
		return expect(subject, "when called with", [oldState, { type: "NOT_A_USEFUL_ACTION" }], "to be", oldState).and(
			"when called with",
			[undefined, { type: "@@INIT" }],
			"to equal",
			Immutable.fromJS(initialState),
		);
	})
	.addAssertion("<function> as a React component <assertion?>", function (expect, Subject, assertions) {
		expect.errorMode = "bubble";
		try {
			const element = React.createElement(Subject);
			return expect.shift(element);
		} catch (e) {
			return expect.fail("Could not create element. ", e.message);
		}
	})
	.addAssertion("<any> to be a label", function (expect, subject) {
		expect.errorMode = "nested";
		if (typeof subject == "object") {
			expect(subject, "to satisfy", {
				id: expect.it("to be a string"),
				defaultMessage: expect.it("to be a string"),
			});
		} else {
			expect(subject, "to be a string");
		}
	})
	.addAssertion("<object> to be a column definition", function (expect, subject) {
		if (subject.type === "select") {
			expect(subject, "to exhaustively satisfy", { type: "select" });
		} else {
			const pattern = {
				fieldName: expect
					.it("to be a string")
					.or("to be an array")
					.and("to have items satisfying", expect.it("to be a string").or("to be a number")),
			};
			if (subject.hasOwnProperty("width")) {
				pattern.width = expect.it("to be a string").and("not to match", /[;:{[]/);
			}
			if (subject.hasOwnProperty("type")) {
				pattern.type = expect
					.it("to be", "number")
					.or("to be", "date")
					.or("to be", "datetime")
					.or("to be", "currency")
					.or("to be", "switch")
					.or("to be", "custom");
				if (subject.type === "currency") {
					pattern.currency = expect
						.it("to be a string")
						.and("to have length", 3)
						.or("to be an array")
						.and("to have items satisfying", "to be a string");
				}
				if (subject.type === "switch" && subject.hasOwnProperty("switch")) {
					pattern.switch = expect.it("to be an object");
				}
				if (subject.type === "custom") {
					pattern.component = expect.it("to be a function");
					if (subject.hasOwnProperty("funcs")) {
						pattern.funcs = expect.it("to have values satisfying", "to be a function");
					}
				}
			}
			if (subject.hasOwnProperty("transform")) {
				pattern.transform = expect.it("to be a function");
			}
			if (subject.hasOwnProperty("label")) {
				pattern.label = expect.it("to be a label");
			}
			if (subject.hasOwnProperty("sort")) {
				pattern.sort = expect.it("to be a function");
			}
			if (subject.hasOwnProperty("defaultValue")) {
				pattern.defaultValue = expect.it("to be defined");
			}
			return expect(subject, "to exhaustively satisfy", pattern);
		}
	});

// Add stub for jsdom scrollTo function
Element.prototype.scrollTo = sinon.stub().named("Element.scrollTo");
