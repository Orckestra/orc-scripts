import React from "react";

const TestComp = () => <div />;

// "<function> to be a reducer with initial state <object>"
// "<ReactShallowRenderer> has elements <assertion?>"
// "<ReactElement> renders elements <assertion>"
// "<function> as a React component <assertion?>"

describe("<any> to be a label", () => {
	it("passes if subject is a string", () =>
		expect(() => expect("Label", "to be a label"), "not to throw"));

	it("passes if subject is a react-intl descriptor", () =>
		expect(
			() =>
				expect(
					{
						id: "foo.test.label",
						defaultMessage: "Label {foo}",
						values: { foo: "A" },
					},
					"to be a label",
				),
			"not to throw",
		));

	it("fails if subject is not a string or object", () =>
		expect(
			() => expect(542, "to be a label"),
			"to throw",
			"expected 542 to be a label\n  expected 542 to be a string",
		));

	it("fails if subject is not a react-intl descriptor", () =>
		expect(
			() => expect({ id: "foo.test.label" }, "to be a label"),
			"to throw",
			"expected { id: 'foo.test.label' } to be a label\n" +
				"  expected { id: 'foo.test.label' } to satisfy\n" +
				"  {\n" +
				"    id: expect.it('to be a string'),\n" +
				"    defaultMessage: expect.it('to be a string')\n" +
				"  }\n" +
				"\n" +
				"  {\n" +
				"    id: 'foo.test.label'\n" +
				"    // missing: defaultMessage: should be a string\n" +
				"  }",
		));
});

describe("<object> to be a column definition", () => {
	it("passes with a select column", () =>
		expect(
			() => expect({ type: "select" }, "to be a column definition"),
			"not to throw",
		));

	it("fails if select column has other parameters", () =>
		expect(
			() =>
				expect(
					{ type: "select", label: "select" },
					"to be a column definition",
				),
			"to throw",
			"expected { type: 'select', label: 'select' } to be a column definition\n" +
				"\n" +
				"{\n" +
				"  type: 'select',\n" +
				"  label: 'select' // should be removed\n" +
				"}",
		));

	it("passes with no type, string field name", () =>
		expect(
			() =>
				expect(
					{
						fieldName: "ColumnA",
					},
					"to be a column definition",
				),
			"not to throw",
		));

	it("fails if there are unknown parameters", () =>
		expect(
			() =>
				expect(
					{
						fieldName: "ColumnA",
						unknownParam: true,
					},
					"to be a column definition",
				),
			"to throw",
			"expected { fieldName: 'ColumnA', unknownParam: true } to be a column definition\n" +
				"\n" +
				"{\n" +
				"  fieldName: 'ColumnA',\n" +
				"  unknownParam: true // should be removed\n" +
				"}",
		));

	it("passes with number type, array field name, transform function", () =>
		expect(
			() =>
				expect(
					{
						type: "number",
						fieldName: ["rowB", 3, "ColumnA"],
						transform: x => x * 10,
					},
					"to be a column definition",
				),
			"not to throw",
		));

	it("fails if array field name contains non-string non-numbers", () =>
		expect(
			() =>
				expect(
					{
						type: "number",
						fieldName: [() => "rowB", 3, "ColumnA"],
					},
					"to be a column definition",
				),
			"to throw",
			"expected { type: 'number', fieldName: [ () => \"rowB\", 3, 'ColumnA' ] }\n" +
				"to be a column definition\n" +
				"\n" +
				"{\n" +
				"  type: 'number',\n" +
				"  fieldName:\n" +
				"    [ () => \"rowB\", 3, 'ColumnA' ] // ⨯ should be a string\n" +
				"                                   // or\n" +
				"                                   // ✓ should be an array and\n" +
				"                                   // ⨯ should have items satisfying\n" +
				"                                   //   expect.it('to be a string')\n" +
				"                                   //         .or('to be a number')\n" +
				"                                   //\n" +
				"                                   //   [\n" +
				'                                   //     () => "rowB", // ⨯ should be a string or\n' +
				"                                   //                   // ⨯ should be a number\n" +
				"                                   //     3,\n" +
				"                                   //     'ColumnA'\n" +
				"                                   //   ]\n" +
				"}",
		));

	it("passes with date type and a string label", () =>
		expect(
			() =>
				expect(
					{
						type: "date",
						fieldName: "ColumnA",
						label: "Column A",
					},
					"to be a column definition",
				),
			"not to throw",
		));

	it("passes with datetime type and a message descriptor label", () =>
		expect(
			() =>
				expect(
					{
						type: "datetime",
						fieldName: "ColumnA",
						label: { id: "test.col_a", defaultMessage: "Column A" },
					},
					"to be a column definition",
				),
			"not to throw",
		));

	it("passes with currency type with a string currency and a sort function", () =>
		expect(
			() =>
				expect(
					{
						type: "currency",
						currency: "USD",
						fieldName: "ColumnA",
						sort: () => {},
					},
					"to be a column definition",
				),
			"not to throw",
		));

	it("fails if currency type has no currency given", () =>
		expect(
			() =>
				expect(
					{
						type: "currency",
						fieldName: "ColumnA",
						sort: () => {},
					},
					"to be a column definition",
				),
			"to throw",
			"expected { type: 'currency', fieldName: 'ColumnA', sort: () => {} }\n" +
				"to be a column definition\n" +
				"\n" +
				"{\n" +
				"  type: 'currency',\n" +
				"  fieldName: 'ColumnA',\n" +
				"  sort: () => {}\n" +
				"  // missing: currency: ⨯ should be a string and\n" +
				"              ⨯ should have length 3\n" +
				"              or\n" +
				"              ⨯ should be an array and\n" +
				"              ⨯ should have items satisfying 'to be a string'\n" +
				"}",
		));

	it("passes with currency type with a data path currency and a default value", () =>
		expect(
			() =>
				expect(
					{
						type: "currency",
						currency: ["data", "currency"],
						fieldName: "ColumnA",
						defaultValue: "12.99",
					},
					"to be a column definition",
				),
			"not to throw",
		));

	it("passes with switch type without settings", () =>
		expect(
			() =>
				expect(
					{
						type: "switch",
						fieldName: "ColumnA",
					},
					"to be a column definition",
				),
			"not to throw",
		));

	it("passes with switch type with settings", () =>
		expect(
			() =>
				expect(
					{
						type: "switch",
						fieldName: "ColumnA",
						switch: {
							onCaption: "On",
							offCaption: "Off",
						},
					},
					"to be a column definition",
				),
			"not to throw",
		));

	it("fails if switch settings found on other type", () =>
		expect(
			() =>
				expect(
					{
						type: "number",
						fieldName: "ColumnA",
						switch: {
							onCaption: "On",
							offCaption: "Off",
						},
					},
					"to be a column definition",
				),
			"to throw",
			"expected\n" +
				"{\n" +
				"  type: 'number',\n" +
				"  fieldName: 'ColumnA',\n" +
				"  switch: { onCaption: 'On', offCaption: 'Off' }\n" +
				"}\n" +
				"to be a column definition\n" +
				"\n" +
				"{\n" +
				"  type: 'number',\n" +
				"  fieldName: 'ColumnA',\n" +
				"  switch: { onCaption: 'On', offCaption: 'Off' } // should be removed\n" +
				"}",
		));

	it("passes with custom type without funcs", () =>
		expect(
			() =>
				expect(
					{
						type: "custom",
						fieldName: "ColumnA",
						component: TestComp,
					},
					"to be a column definition",
				),
			"not to throw",
		));

	it("passes with custom type with funcs", () =>
		expect(
			() =>
				expect(
					{
						type: "custom",
						fieldName: "ColumnA",
						component: TestComp,
						funcs: {
							test: () => {},
						},
					},
					"to be a column definition",
				),
			"not to throw",
		));

	it("fails if component or funcs on non-custom type", () =>
		expect(
			() =>
				expect(
					{
						type: "date",
						fieldName: "ColumnA",
						component: TestComp,
						funcs: {
							test: () => {},
						},
					},
					"to be a column definition",
				),
			"to throw",
			"expected\n" +
				"{\n" +
				"  type: 'date',\n" +
				"  fieldName: 'ColumnA',\n" +
				'  component: () => _react.default.createElement("div", null),\n' +
				"  funcs: { test: () => {} }\n" +
				"}\n" +
				"to be a column definition\n" +
				"\n" +
				"{\n" +
				"  type: 'date',\n" +
				"  fieldName: 'ColumnA',\n" +
				'  component: () => _react.default.createElement("div", null), // should be removed\n' +
				"  funcs: { test: () => {} } // should be removed\n" +
				"}",
		));
});

describe("<array-like> to be a form definition", () => {
	describe("<object> to be a form field", () => {
		describe("type 'Button'", () => {});

		describe("type 'CheckboxInput'", () => {
			it("passes with a name only", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "CheckboxInput" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and string label", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "CheckboxInput", label: "A field" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "CheckboxInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and non-textual input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "CheckboxInput",
								autofocus: true,
								disabled: true,
								required: true,
								tabindex: 12,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if given extraneous fields", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "CheckboxInput",
								extra: true,
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'Field1', type: 'CheckboxInput', extra: true } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'CheckboxInput',\n" +
						"  extra: true // should be removed\n" +
						"}",
				));
		});

		describe("type 'DateInput'", () => {
			it("passes with a name only", () =>
				expect(
					() =>
						expect({ name: "field1", type: "DateInput" }, "to be a form field"),
					"not to throw",
				));

			it("passes with a name and string label", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "DateInput", label: "A field" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "DateInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "DateInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and general input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "DateInput",
								autocomplete: "on",
								autofocus: true,
								disabled: true,
								readonly: true,
								required: true,
								tabindex: 12,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and date input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "DateInput",
								max: "2012-04-15",
								min: "2010-02-12",
								step: 2,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if given extraneous fields", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "DateInput",
								extra: true,
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'Field1', type: 'DateInput', extra: true } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'DateInput',\n" +
						"  extra: true // should be removed\n" +
						"}",
				));
		});

		describe("type 'EmailInput'", () => {
			it("passes with a name only", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "EmailInput" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and string label", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "EmailInput", label: "A field" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "EmailInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "EmailInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and general input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "EmailInput",
								autocomplete: "on",
								autofocus: true,
								disabled: true,
								readonly: true,
								required: true,
								tabindex: 12,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and email input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "EmailInput",
								maxlength: 15,
								minlength: 3,
								multiple: true,
								pattern: /olo/,
								placeholder: "Placeholder here",
								size: 18,
								spellcheck: "",
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if given extraneous fields", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "EmailInput",
								extra: true,
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'Field1', type: 'EmailInput', extra: true } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'EmailInput',\n" +
						"  extra: true // should be removed\n" +
						"}",
				));
		});

		describe("type 'MultiSelector'", () => {});

		describe("type 'LineLabel'", () => {
			it("passes with a name only", () =>
				expect(
					() =>
						expect({ name: "field1", type: "LineLabel" }, "to be a form field"),
					"not to throw",
				));

			it("passes with a name and string label", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "LineLabel", label: "A field" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "LineLabel",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if given extraneous fields", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "LineLabel",
								extra: true,
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'Field1', type: 'LineLabel', extra: true } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'LineLabel',\n" +
						"  extra: true // should be removed\n" +
						"}",
				));
		});

		describe("type 'NumberInput'", () => {
			it("passes with a name only", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "NumberInput" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and string label", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "NumberInput", label: "A field" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "NumberInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "NumberInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and general input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "NumberInput",
								autocomplete: "on",
								autofocus: true,
								disabled: true,
								readonly: true,
								required: true,
								tabindex: 12,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and number input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "NumberInput",
								max: 200,
								min: 2,
								placeholder: 16,
								step: 2,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if given extraneous fields", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "NumberInput",
								extra: true,
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'Field1', type: 'NumberInput', extra: true } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'NumberInput',\n" +
						"  extra: true // should be removed\n" +
						"}",
				));
		});

		describe("type 'ReadOnly'", () => {
			it("passes with a name only", () =>
				expect(
					() =>
						expect({ name: "field1", type: "ReadOnly" }, "to be a form field"),
					"not to throw",
				));

			it("passes with a name and string label", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "ReadOnly", label: "A field" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "ReadOnly",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if given extraneous fields", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "ReadOnly",
								extra: true,
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'Field1', type: 'ReadOnly', extra: true } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'ReadOnly',\n" +
						"  extra: true // should be removed\n" +
						"}",
				));
		});

		describe("type 'Selector'", () => {
			it("passes with a name and empty options only", () =>
				expect(
					() =>
						expect(
							{
								name: "field1",
								type: "Selector",
								options: [],
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and string label, string options", () =>
				expect(
					() =>
						expect(
							{
								name: "field1",
								type: "Selector",
								label: "A field",
								options: [{ label: "Foo", value: "foo" }],
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label, object options", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "Selector",
								label: { id: "test.field1", defaultMessage: "A field" },
								options: [
									{
										label: { id: "test.option", defaultMessage: "Foo" },
										value: "foo",
									},
								],
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "Selector",
								label: { id: "test.field1", defaultMessage: "A field" },
								options: [{ label: "Foo", value: "foo" }],
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and general input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "Selector",
								options: [{ label: "Foo", value: "foo" }],
								autocomplete: "on",
								autofocus: true,
								disabled: true,
								readonly: true,
								required: true,
								tabindex: 12,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if options missing", () =>
				expect(
					() =>
						expect(
							{
								name: "field1",
								type: "Selector",
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'field1', type: 'Selector' } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'field1',\n" +
						"  type: 'Selector'\n" +
						"  // missing: options: ⨯ should be an array and\n" +
						"              ⨯ should have items satisfying { label: expect.it('to be a label'), value: expect.it('to be defined') }\n" +
						"              or\n" +
						"              ⨯ should equal []\n" +
						"}",
				));

			it("fails if given extraneous fields", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "Selector",
								options: [{ label: "Foo", value: "foo" }],
								extra: true,
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'Selector',\n" +
						"  options: [ { label: 'Foo', value: 'foo' } ],\n" +
						"  extra: true\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'Selector',\n" +
						"  options: [ { label: 'Foo', value: 'foo' } ],\n" +
						"  extra: true // should be removed\n" +
						"}",
				));
		});

		describe("type 'SmallButton'", () => {});

		describe("type 'SwitchInput'", () => {
			it("passes with a name only", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "SwitchInput" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and string label", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "SwitchInput", label: "A field" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "SwitchInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and non-textual input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "SwitchInput",
								autofocus: true,
								disabled: true,
								required: true,
								tabindex: 12,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and switch input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "SwitchInput",
								onCaption: "On",
								offCaption: "Off",
								onColor: "#00FF00",
								offColor: "#FF0000",
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if given extraneous fields", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "SwitchInput",
								extra: true,
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'Field1', type: 'SwitchInput', extra: true } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'SwitchInput',\n" +
						"  extra: true // should be removed\n" +
						"}",
				));
		});

		describe("type 'TextInput'", () => {
			it("passes with a name only", () =>
				expect(
					() =>
						expect({ name: "field1", type: "TextInput" }, "to be a form field"),
					"not to throw",
				));

			it("passes with a name and string label", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "TextInput", label: "A field" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TextInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TextInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and general input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TextInput",
								autocomplete: "on",
								autofocus: true,
								disabled: true,
								readonly: true,
								required: true,
								tabindex: 12,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and text input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TextInput",
								maxlength: 15,
								minlength: 3,
								pattern: /olo/,
								placeholder: "Placeholder here",
								size: 18,
								spellcheck: "",
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if given extraneous fields", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TextInput",
								extra: true,
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'Field1', type: 'TextInput', extra: true } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'TextInput',\n" +
						"  extra: true // should be removed\n" +
						"}",
				));
		});

		describe("type 'TimeInput'", () => {
			it("passes with a name only", () =>
				expect(
					() =>
						expect({ name: "field1", type: "TimeInput" }, "to be a form field"),
					"not to throw",
				));

			it("passes with a name and string label", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "TimeInput", label: "A field" },
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TimeInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and object label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TimeInput",
								label: { id: "test.field1", defaultMessage: "A field" },
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and general input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TimeInput",
								autocomplete: "on",
								autofocus: true,
								disabled: true,
								readonly: true,
								required: true,
								tabindex: 12,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("passes with a name and date input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TimeInput",
								max: "15:35",
								min: "22:21:05",
								step: "any",
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if given extraneous fields", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TimeInput",
								extra: true,
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'Field1', type: 'TimeInput', extra: true } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'TimeInput',\n" +
						"  extra: true // should be removed\n" +
						"}",
				));
		});

		describe("type 'TranslationInput'", () => {});

		describe("type 'InvalidType'", () => {
			it("fails with a coherent message", () =>
				expect(
					() =>
						expect(
							{ name: "field1", type: "InvalidType" },
							"to be a form field",
						),
					"to throw",
					"expected { name: 'field1', type: 'InvalidType' } to be a form field\n" +
						"  Invalid type 'InvalidType'",
				));
		});
	});
});
