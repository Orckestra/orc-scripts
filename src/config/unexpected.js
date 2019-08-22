const unexpected = require("unexpected");
const unexpectedReact = require("unexpected-react");
const unexpectedStyled = require("./unexpected-styled");
const unexpectedModule = require("./unexpected-module");
const unexpectedSinon = require("unexpected-sinon");
const unexpectedImmutable = require("unexpected-immutable");
const React = require("react");
const Immutable = require("immutable");

global.expect = unexpected
	.clone()
	.use(unexpectedReact)
	.use(unexpectedStyled)
	.use(unexpectedModule)
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
		renderer,
	) {
		expect.errorMode = "nested";
		return expect.shift(renderer.getRenderOutput());
	})
	.addAssertion("<ReactElement> renders elements <assertion>", function(
		expect,
		subject,
	) {
		expect.errorMode = "nested";
		return expect(subject, "when rendered", "has elements").then(function(
			elements,
		) {
			return expect.shift(elements);
		});
	})
	.addAssertion("<function> as a React component <assertion?>", function(
		expect,
		Subject,
		assertions,
	) {
		expect.errorMode = "bubble";
		try {
			const element = React.createElement(Subject);
			return expect.shift(element);
		} catch (e) {
			return expect.fail("Could not create element. ", e.message);
		}
	})
	.addAssertion("<any> to be a label", function(expect, subject) {
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
	.addAssertion("<object> to be a column definition", function(
		expect,
		subject,
	) {
		if (subject.type === "select") {
			expect(subject, "to exhaustively satisfy", { type: "select" });
		} else {
			const pattern = {
				fieldName: expect
					.it("to be a string")
					.or("to be an array")
					.and(
						"to have items satisfying",
						expect.it("to be a string").or("to be a number"),
					),
			};
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
						pattern.funcs = expect.it(
							"to have values satisfying",
							"to be a function",
						);
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
	})
	.addAssertion("<object> to be a form field", function(expect, subject) {
		const type = subject.type;
		const pattern = {
			type: expect.it("to be a string"),
			name: expect.it("to be a string"),
		};
		switch (type) {
			case "CheckboxInput":
				addLabelProp(expect, subject, pattern);
				addInputProps(expect, subject, pattern, false);
				break;
			case "DateInput":
				addLabelProp(expect, subject, pattern);
				addInputProps(expect, subject, pattern);
				addDateInputProps(expect, subject, pattern);
				break;
			case "EmailInput":
				addLabelProp(expect, subject, pattern);
				addInputProps(expect, subject, pattern);
				addTextInputProps(expect, subject, pattern);
				addMultipleProp(expect, subject, pattern);
				break;
			case "LineLabel":
				addLabelProp(expect, subject, pattern);
				break;
			case "NumberInput":
				addLabelProp(expect, subject, pattern);
				addInputProps(expect, subject, pattern);
				addNumberInputProps(expect, subject, pattern);
				break;
			case "ReadOnly":
				addLabelProp(expect, subject, pattern);
				break;
			case "Selector":
				addLabelProp(expect, subject, pattern);
				addInputProps(expect, subject, pattern);
				addOptionProp(expect, subject, pattern);
				break;
			case "SwitchInput":
				addLabelProp(expect, subject, pattern);
				addInputProps(expect, subject, pattern, false);
				addSwitchInputProps(expect, subject, pattern);
				break;
			case "TextInput":
				addLabelProp(expect, subject, pattern);
				addInputProps(expect, subject, pattern);
				addTextInputProps(expect, subject, pattern);
				break;
			case "TimeInput":
				addLabelProp(expect, subject, pattern);
				addInputProps(expect, subject, pattern);
				addTimeInputProps(expect, subject, pattern);
				break;
			default:
				expect.errorMode = "nested";
				return expect.fail("Invalid type {0}", type);
		}
		return expect(subject, "to exhaustively satisfy", pattern);
	});

const addLabelProp = (expect, subject, pattern) => {
	if (subject.hasOwnProperty("label")) {
		pattern.label = expect.it("to be a label");
	}
};

const addMultipleProp = (expect, subject, pattern) => {
	if (subject.hasOwnProperty("multiple")) {
		pattern.multiple = expect.it("to be a boolean");
	}
};

const addInputProps = (expect, subject, pattern, textual = true) => {
	if (textual && subject.hasOwnProperty("autocomplete")) {
		pattern.autocomplete = expect.it("to be a string");
	}
	if (subject.hasOwnProperty("autofocus")) {
		pattern.autofocus = expect.it("to be a boolean");
	}
	if (subject.hasOwnProperty("disabled")) {
		pattern.disabled = expect.it("to be a boolean");
	}
	if (textual && subject.hasOwnProperty("readonly")) {
		pattern.readonly = expect.it("to be a boolean");
	}
	if (subject.hasOwnProperty("required")) {
		pattern.required = expect.it("to be a boolean");
	}
	if (subject.hasOwnProperty("tabindex")) {
		pattern.tabindex = expect.it("to be a number");
	}
};

const addTextInputProps = (expect, subject, pattern) => {
	if (subject.hasOwnProperty("maxlength")) {
		pattern.maxlength = expect.it("to be a number");
	}
	if (subject.hasOwnProperty("minlength")) {
		pattern.minlength = expect.it("to be a number");
	}
	if (subject.hasOwnProperty("pattern")) {
		pattern.pattern = expect.it("to be a regular expression");
	}
	if (subject.hasOwnProperty("placeholder")) {
		pattern.placeholder = expect.it("to be a string");
	}
	if (subject.hasOwnProperty("size")) {
		pattern.size = expect.it("to be a number");
	}
	if (subject.hasOwnProperty("spellcheck")) {
		pattern.spellcheck = expect.it("to be a boolean").or("to be", "");
	}
};

const addNumberInputProps = (expect, subject, pattern) => {
	if (subject.hasOwnProperty("max")) {
		pattern.max = expect.it("to be a number");
	}
	if (subject.hasOwnProperty("min")) {
		pattern.min = expect.it("to be a number");
	}
	if (subject.hasOwnProperty("placeholder")) {
		pattern.placeholder = expect.it("to be a number");
	}
	if (subject.hasOwnProperty("step")) {
		pattern.step = expect.it("to be a number");
	}
};

const addDateInputProps = (expect, subject, pattern) => {
	if (subject.hasOwnProperty("max")) {
		pattern.max = expect.it("to match", /^\d{4}-\d{2}-\d{2}$/);
	}
	if (subject.hasOwnProperty("min")) {
		pattern.min = expect.it("to match", /^\d{4}-\d{2}-\d{2}$/);
	}
	if (subject.hasOwnProperty("step")) {
		pattern.step = expect.it("to be a number");
	}
};

const addTimeInputProps = (expect, subject, pattern) => {
	if (subject.hasOwnProperty("max")) {
		pattern.max = expect.it("to match", /^\d{2}:\d{2}(?::\d{2})?$/);
	}
	if (subject.hasOwnProperty("min")) {
		pattern.min = expect.it("to match", /^\d{2}:\d{2}(?::\d{2})?$/);
	}
	if (subject.hasOwnProperty("step")) {
		pattern.step = expect.it("to be a number").or("to be", "any");
	}
};

const addSwitchInputProps = (expect, subject, pattern) => {
	if (subject.hasOwnProperty("onCaption")) {
		pattern.onCaption = expect.it("to be a label");
	}
	if (subject.hasOwnProperty("offCaption")) {
		pattern.offCaption = expect.it("to be a label");
	}
	if (subject.hasOwnProperty("onColor")) {
		pattern.onColor = expect.it("to be a string");
	}
	if (subject.hasOwnProperty("offColor")) {
		pattern.offColor = expect.it("to be a string");
	}
};

const addOptionProp = (expect, subject, pattern) => {
	pattern.options = expect
		.it("to be an array")
		.and("to have items satisfying", {
			label: expect.it("to be a label"),
			value: expect.it("to be defined"),
		})
		.or("to equal", []);
};
