import React from "react";

const TestComp = () => <div />;

// "<function> to be a reducer with initial state <object>"
// "<ReactShallowRenderer> has elements <assertion?>"
// "<ReactElement> renders elements <assertion>"
// "<function> as a React component <assertion?>"

describe("<any> to be a label", () => {
	it("passes if subject is a string", () => expect(() => expect("Label", "to be a label"), "not to throw"));

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
		expect(() => expect({ type: "select" }, "to be a column definition"), "not to throw"));

	it("fails if select column has other parameters", () =>
		expect(
			() => expect({ type: "select", label: "select" }, "to be a column definition"),
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

	it("passes with no type, string field name, width", () =>
		expect(
			() =>
				expect(
					{
						fieldName: "ColumnA",
						width: "400px",
					},
					"to be a column definition",
				),
			"not to throw",
		));

	it("fails if width contains suspicious characters", () =>
		expect(
			() =>
				expect(
					{
						fieldName: "ColumnA",
						width: "400px;",
					},
					"to be a column definition",
				),
			"to throw",
			"expected { fieldName: 'ColumnA', width: '400px;' } to be a column definition\n" +
				"\n" +
				"{\n" +
				"  fieldName: 'ColumnA',\n" +
				"  width: '400px;' // ✓ should be a string and\n" +
				"                  // ⨯ should not match /[;:{[]/\n" +
				"                  //\n" +
				"                  //   400px;\n" +
				"                  //        ^\n" +
				"}",
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
				"  component: " +
				TestComp.toString() +
				",\n" +
				"  funcs: { test: () => {} }\n" +
				"}\n" +
				"to be a column definition\n" +
				"\n" +
				"{\n" +
				"  type: 'date',\n" +
				"  fieldName: 'ColumnA',\n" +
				"  component: " +
				TestComp.toString() +
				", // should be removed\n" +
				"  funcs: { test: () => {} } // should be removed\n" +
				"}",
		));
});
