module.exports = {
	name: "unexpected-form",
	installInto: function (expect) {
		expect.addAssertion("<object> to be a form field", function (expect, subject) {
			const type = subject.type;
			const pattern = {
				type: expect.it("to be a string"),
				name: expect.it("to be a string"),
			};
			switch (type) {
				case "Button":
					addLabelProp(expect, subject, pattern);
					addButtonProps(expect, subject, pattern);
					break;
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
				case "MultiSelector":
					addLabelProp(expect, subject, pattern);
					addInputProps(expect, subject, pattern);
					addOptionProp(expect, subject, pattern);
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
				case "SmallButton":
					addLabelProp(expect, subject, pattern);
					addButtonProps(expect, subject, pattern, true);
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
				case "TranslationInput":
					pattern.moreLabel = expect.it("to be a label");
					addLabelProp(expect, subject, pattern);
					addInputProps(expect, subject, pattern);
					addTextInputProps(expect, subject, pattern);
					break;
				default:
					if (["Fieldset", "Combination", "List"].includes(type)) {
						return expect.fail();
					}
					expect.errorMode = "nested";
					return expect.fail("Invalid type {0}", type);
			}
			return expect(subject, "to satisfy", pattern);
		});

		expect.addAssertion("<object> to be a form combination field", function (expect, subject) {
			if (subject.type !== "Combination") {
				expect.fail();
			}
			const pattern = {
				type: "Combination",
				fields: expect.it("to be an array").and("to have items satisfying", "to be a form field"),
			};
			if (Object.prototype.hasOwnProperty.call(subject, "proportions")) {
				pattern.proportions = expect
					.it("to be an array")
					.and("to have items satisfying", expect.it("to be a string").or("to be a number"))
					.and("to be shorter than or same length as", subject.fields);
			}
			return expect(subject, "to satisfy", pattern);
		});

		expect.addAssertion("<object> to be a form list", function (expect, subject) {
			if (subject.type !== "List") {
				expect.fail();
			}
			const pattern = {
				type: "List",
				name: expect.it("to be a string"),
				rowField: expect.it("to be a form field").or("to be a form combination field"),
			};
			if (Object.prototype.hasOwnProperty.call(subject, "rowCount")) {
				pattern.rowCount = expect.it("to be a number");
			}
			if (Object.prototype.hasOwnProperty.call(subject, "add")) {
				if (subject.rowCount) {
					expect.errorMode = "nested";
					return expect.fail("Form list with row count cannot have 'add' label");
				}
				pattern.add = expect.it("to be a label");
			}
			if (Object.prototype.hasOwnProperty.call(subject, "staticValues")) {
				if (!subject.rowCount) {
					expect.errorMode = "nested";
					return expect.fail("Form list without row count cannot have static values");
				}
				pattern.staticValues = expect.it("to be an array");
			}
			return expect(subject, "to satisfy", pattern);
		});

		expect.addAssertion("<object> to be a form fieldset", function (expect, subject) {
			if (subject.type !== "Fieldset") {
				expect.fail();
			}
			const pattern = {
				type: "Fieldset",
				label: expect.it("to be a label"),
				fields: expect
					.it("to be an array")
					.and(
						"to have items satisfying",
						expect.it("to be a form field").or("to be a form combination field").or("to be a form list"),
					),
			};
			expect(subject, "to satisfy", pattern);
		});

		expect.addAssertion("<array-like> to be a form definition", function (expect, subject) {
			return expect(
				subject,
				"to have items satisfying",
				expect
					.it("to be a form field")
					.or("to be a form combination field")
					.or("to be a form list")
					.or("to be a form fieldset"),
			);
		});

		expect.addAssertion(
			[
				"<undefined> to be a form field",
				"<undefined> to be a form combination field",
				"<undefined> to be a form list",
				"<undefined> to be a form fieldset",
			],
			function (expect) {
				return expect.fail();
			},
		);
	},
};

const addLabelProp = (expect, subject, pattern) => {
	if (Object.prototype.hasOwnProperty.call(subject, "label")) {
		pattern.label = expect.it("to be a label");
	}
};

const addMultipleProp = (expect, subject, pattern) => {
	if (Object.prototype.hasOwnProperty.call(subject, "multiple")) {
		pattern.multiple = expect.it("to be a boolean");
	}
};

const addButtonProps = (expect, subject, pattern, small) => {
	if (Object.prototype.hasOwnProperty.call(subject, "primary")) {
		pattern.primary = expect.it("to be a boolean");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "active")) {
		pattern.active = expect.it("to be a boolean");
	}
	if (small) {
		pattern.altText = expect.it("to be a label");
		pattern.icon = expect.it("to be a string");
	} else {
		if (Object.prototype.hasOwnProperty.call(subject, "buttonText")) {
			pattern.buttonText = expect.it("to be a label");
		}
		if (Object.prototype.hasOwnProperty.call(subject, "icon")) {
			pattern.icon = expect.it("to be a string");
		}
	}
	if (Object.prototype.hasOwnProperty.call(subject, "autofocus")) {
		pattern.autofocus = expect.it("to be a boolean");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "disabled")) {
		pattern.disabled = expect.it("to be a boolean");
	}
};

const addInputProps = (expect, subject, pattern, textual = true) => {
	if (textual && Object.prototype.hasOwnProperty.call(subject, "autocomplete")) {
		pattern.autocomplete = expect.it("to be a string");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "autofocus")) {
		pattern.autofocus = expect.it("to be a boolean");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "disabled")) {
		pattern.disabled = expect.it("to be a boolean");
	}
	if (textual && Object.prototype.hasOwnProperty.call(subject, "readOnly")) {
		pattern.readOnly = expect.it("to be a boolean");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "required")) {
		pattern.required = expect.it("to be a label");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "tabindex")) {
		pattern.tabindex = expect.it("to be a number");
	}
};

const addTextInputProps = (expect, subject, pattern) => {
	if (Object.prototype.hasOwnProperty.call(subject, "maxlength")) {
		pattern.maxlength = expect.it("to be a number").and("to be greater than", 0);
	}
	if (Object.prototype.hasOwnProperty.call(subject, "minlength")) {
		pattern.minlength = expect.it("to be a number").and("to be greater than", 0);
	}
	if (Object.prototype.hasOwnProperty.call(subject, "pattern")) {
		pattern.pattern = expect.it("to be a regular expression");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "placeholder")) {
		pattern.placeholder = expect.it("to be a label");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "size")) {
		pattern.size = expect.it("to be a number").and("to be greater than", 0);
	}
	if (Object.prototype.hasOwnProperty.call(subject, "spellcheck")) {
		pattern.spellcheck = expect.it("to be a boolean").or("to be", "");
	}
};

const addNumberInputProps = (expect, subject, pattern) => {
	if (Object.prototype.hasOwnProperty.call(subject, "max")) {
		pattern.max = expect.it("to be a number");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "min")) {
		pattern.min = expect.it("to be a number");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "step")) {
		pattern.step = expect.it("to be a number");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "placeholder")) {
		pattern.placeholder = expect.it("to be a label");
	}
};

const addDateInputProps = (expect, subject, pattern) => {
	if (Object.prototype.hasOwnProperty.call(subject, "max")) {
		pattern.max = expect.it("to be a string").and("to match", /^\d{4}-\d{2}-\d{2}$/);
	}
	if (Object.prototype.hasOwnProperty.call(subject, "min")) {
		pattern.min = expect.it("to be a string").and("to match", /^\d{4}-\d{2}-\d{2}$/);
	}
	if (Object.prototype.hasOwnProperty.call(subject, "step")) {
		pattern.step = expect.it("to be a number");
	}
};

const addTimeInputProps = (expect, subject, pattern) => {
	if (Object.prototype.hasOwnProperty.call(subject, "max")) {
		pattern.max = expect.it("to be a string").and("to match", /^\d{2}:\d{2}(?::\d{2})?$/);
	}
	if (Object.prototype.hasOwnProperty.call(subject, "min")) {
		pattern.min = expect.it("to be a string").and("to match", /^\d{2}:\d{2}(?::\d{2})?$/);
	}
	if (Object.prototype.hasOwnProperty.call(subject, "step")) {
		pattern.step = expect.it("to be a number").or("to be", "any");
	}
};

const addSwitchInputProps = (expect, subject, pattern) => {
	if (Object.prototype.hasOwnProperty.call(subject, "onCaption")) {
		pattern.onCaption = expect.it("to be a label");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "offCaption")) {
		pattern.offCaption = expect.it("to be a label");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "onColor")) {
		pattern.onColor = expect.it("to be a string");
	}
	if (Object.prototype.hasOwnProperty.call(subject, "offColor")) {
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
