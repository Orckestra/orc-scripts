module.exports = {
	name: "unexpected-form",
	version: "0.0.1",
	installInto: function(expect) {
		expect.addAssertion("<object> to be a form field", function(
			expect,
			subject,
		) {
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
					expect.errorMode = "nested";
					return expect.fail("Invalid type {0}", type);
			}
			return expect(subject, "to satisfy", pattern);
		});
		expect.addAssertion("<object> to be a form combination field", function(
			expect,
			subject,
		) {
			const pattern = {
				type: "Combination",
				fields: expect
					.it("to be an array")
					.and("to have items satisfying", "to be a form field"),
			};
			if (subject.hasOwnProperty("proportions")) {
				pattern.proportions = expect
					.it("to be an array")
					.and("to be shorter than or same length as", subject.fields);
			}
			return expect(subject, "to satisfy", pattern);
		});
	},
};

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

const addButtonProps = (expect, subject, pattern, small) => {
	if (subject.hasOwnProperty("primary")) {
		pattern.primary = expect.it("to be a boolean");
	}
	if (subject.hasOwnProperty("active")) {
		pattern.active = expect.it("to be a boolean");
	}
	if (small) {
		pattern.altText = expect.it("to be a label");
		pattern.icon = expect.it("to be a string");
	} else {
		if (subject.hasOwnProperty("buttonText")) {
			pattern.buttonText = expect.it("to be a label");
		}
		if (subject.hasOwnProperty("icon")) {
			pattern.icon = expect.it("to be a string");
		}
	}
	if (subject.hasOwnProperty("autofocus")) {
		pattern.autofocus = expect.it("to be a boolean");
	}
	if (subject.hasOwnProperty("disabled")) {
		pattern.disabled = expect.it("to be a boolean");
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
		pattern.maxlength = expect
			.it("to be a number")
			.and("to be greater than", 0);
	}
	if (subject.hasOwnProperty("minlength")) {
		pattern.minlength = expect
			.it("to be a number")
			.and("to be greater than", 0);
	}
	if (subject.hasOwnProperty("pattern")) {
		pattern.pattern = expect.it("to be a regular expression");
	}
	if (subject.hasOwnProperty("placeholder")) {
		pattern.placeholder = expect.it("to be a string");
	}
	if (subject.hasOwnProperty("size")) {
		pattern.size = expect.it("to be a number").and("to be greater than", 0);
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
		pattern.max = expect
			.it("to be a string")
			.and("to match", /^\d{4}-\d{2}-\d{2}$/);
	}
	if (subject.hasOwnProperty("min")) {
		pattern.min = expect
			.it("to be a string")
			.and("to match", /^\d{4}-\d{2}-\d{2}$/);
	}
	if (subject.hasOwnProperty("step")) {
		pattern.step = expect.it("to be a number");
	}
};

const addTimeInputProps = (expect, subject, pattern) => {
	if (subject.hasOwnProperty("max")) {
		pattern.max = expect
			.it("to be a string")
			.and("to match", /^\d{2}:\d{2}(?::\d{2})?$/);
	}
	if (subject.hasOwnProperty("min")) {
		pattern.min = expect
			.it("to be a string")
			.and("to match", /^\d{2}:\d{2}(?::\d{2})?$/);
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
