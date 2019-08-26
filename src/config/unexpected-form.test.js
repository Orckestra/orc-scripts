describe("<array-like> to be a form definition", () => {
	describe("<object> to be a form field", () => {
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

		it("fails if name not a string", () =>
			expect(
				() =>
					expect(
						{ name: ["field1"], type: "CheckboxInput" },
						"to be a form field",
					),
				"to throw",
				"expected { name: [ 'field1' ], type: 'CheckboxInput' } to be a form field\n" +
					"\n" +
					"{\n" +
					"  name: [ 'field1' ], // should be a string\n" +
					"  type: 'CheckboxInput'\n" +
					"}",
			));

		it("fails if type not a string", () =>
			expect(
				() =>
					expect(
						{ name: "field1", type: ["InvalidType"] },
						"to be a form field",
					),
				"to throw",
				"expected { name: 'field1', type: [ 'InvalidType' ] } to be a form field\n" +
					"  Invalid type [ 'InvalidType' ]",
			));

		it("fails if type not valid", () =>
			expect(
				() =>
					expect({ name: "field1", type: "InvalidType" }, "to be a form field"),
				"to throw",
				"expected { name: 'field1', type: 'InvalidType' } to be a form field\n" +
					"  Invalid type 'InvalidType'",
			));

		describe("type 'Button'", () => {
			it("passes with a name and button attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "Button",
								primary: true,
								active: true,
								buttonText: {
									id: "test.button.label",
									defaultMessage: "Label",
								},
								icon: "an-icon",
								autofocus: true,
								disabled: true,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if button attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "Button",
								primary: "foo",
								active: 0,
								buttonText: { defaultMessage: "A label" },
								icon: [],
								autofocus: {},
								disabled: "!true",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'Button', primary: 'foo', active: 0,\n" +
						"  buttonText: { defaultMessage: 'A label' }, icon: [], autofocus: {},\n" +
						"  disabled: '!true'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'Button',\n" +
						"  primary: 'foo', // should be a boolean\n" +
						"  active: 0, // should be a boolean\n" +
						"  buttonText:\n" +
						"    { defaultMessage: 'A label' }, // should be a label\n" +
						"                                   //   should satisfy\n" +
						"                                   //   {\n" +
						"                                   //     id: expect.it('to be a string'),\n" +
						"                                   //     defaultMessage: expect.it('to be a string')\n" +
						"                                   //   }\n" +
						"                                   //\n" +
						"                                   //   {\n" +
						"                                   //     defaultMessage: 'A label'\n" +
						"                                   //     // missing: id: should be a string\n" +
						"                                   //   }\n" +
						"  icon: [], // should be a string\n" +
						"  autofocus: {}, // should be a boolean\n" +
						"  disabled: '!true' // should be a boolean\n" +
						"}",
				));
		});

		describe("type 'CheckboxInput'", () => {
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

			it("fails if non-textual input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "CheckboxInput",
								autofocus: "true",
								disabled: 1,
								required: [],
								tabindex: "",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'CheckboxInput', autofocus: 'true', disabled: 1,\n" +
						"  required: [], tabindex: ''\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'CheckboxInput',\n" +
						"  autofocus: 'true', // should be a boolean\n" +
						"  disabled: 1, // should be a boolean\n" +
						"  required: [], // should be a boolean\n" +
						"  tabindex: '' // should be a number\n" +
						"}",
				));
		});

		describe("type 'DateInput'", () => {
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

			it("fails if general input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "DateInput",
								autocomplete: "on",
								autofocus: "true",
								disabled: 0,
								readonly: { t: true },
								required: [],
								tabindex: "foo",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'DateInput', autocomplete: 'on',\n" +
						"  autofocus: 'true', disabled: 0, readonly: { t: true }, required: [],\n" +
						"  tabindex: 'foo'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'DateInput',\n" +
						"  autocomplete: 'on',\n" +
						"  autofocus: 'true', // should be a boolean\n" +
						"  disabled: 0, // should be a boolean\n" +
						"  readonly: { t: true }, // should be a boolean\n" +
						"  required: [], // should be a boolean\n" +
						"  tabindex: 'foo' // should be a number\n" +
						"}",
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

			it("fails if date input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "DateInput",
								max: "4th of July",
								min: 2010,
								step: "1 minute",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'DateInput',\n" +
						"  max: '4th of July',\n" +
						"  min: 2010,\n" +
						"  step: '1 minute'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'DateInput',\n" +
						"  max: '4th of July', // ✓ should be a string and\n" +
						"                      // ⨯ should match /^\\d{4}-\\d{2}-\\d{2}$/\n" +
						"  min: 2010, // ⨯ should be a string and\n" +
						"             // ⨯ should match /^\\d{4}-\\d{2}-\\d{2}$/\n" +
						"  step: '1 minute' // should be a number\n" +
						"}",
				));
		});

		describe("type 'EmailInput'", () => {
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

			it("fails if general input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "EmailInput",
								autocomplete: "on",
								autofocus: "true",
								disabled: 0,
								readonly: { t: true },
								required: [],
								tabindex: "foo",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'EmailInput', autocomplete: 'on',\n" +
						"  autofocus: 'true', disabled: 0, readonly: { t: true }, required: [],\n" +
						"  tabindex: 'foo'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'EmailInput',\n" +
						"  autocomplete: 'on',\n" +
						"  autofocus: 'true', // should be a boolean\n" +
						"  disabled: 0, // should be a boolean\n" +
						"  readonly: { t: true }, // should be a boolean\n" +
						"  required: [], // should be a boolean\n" +
						"  tabindex: 'foo' // should be a number\n" +
						"}",
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

			it("fails if email input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "EmailInput",
								maxlength: "15",
								minlength: -4,
								multiple: "no",
								pattern: 33,
								placeholder: { foo: "Placeholder here" },
								size: 0,
								spellcheck: "wut",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'EmailInput', maxlength: '15', minlength: -4,\n" +
						"  multiple: 'no', pattern: 33, placeholder: { foo: 'Placeholder here' },\n" +
						"  size: 0, spellcheck: 'wut'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'EmailInput',\n" +
						"  maxlength:\n" +
						"    '15', // ⨯ should be a number and\n" +
						"          // ⨯ should be greater than 0\n" +
						"  minlength:\n" +
						"    -4, // ✓ should be a number and\n" +
						"        // ⨯ should be greater than 0\n" +
						"  multiple: 'no', // should be a boolean\n" +
						"  pattern: 33, // should be a regular expression\n" +
						"  placeholder: { foo: 'Placeholder here' }, // should be a string\n" +
						"  size: 0, // ✓ should be a number and\n" +
						"           // ⨯ should be greater than 0\n" +
						"  spellcheck:\n" +
						"    'wut' // ⨯ should be a boolean or\n" +
						"          // ⨯ should be ''\n" +
						"          //\n" +
						"          //   -wut\n" +
						"}",
				));
		});

		describe("type 'MultiSelector'", () => {
			it("passes with a name and empty options only", () =>
				expect(
					() =>
						expect(
							{
								name: "field1",
								type: "MultiSelector",
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
								type: "MultiSelector",
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
								type: "MultiSelector",
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

			it("passes with a name and general input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "MultiSelector",
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

			it("fails if general input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "MultiSelector",
								options: [{ label: "Foo", value: "foo" }],
								autocomplete: "on",
								autofocus: "true",
								disabled: 0,
								readonly: { t: true },
								required: [],
								tabindex: "foo",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'MultiSelector',\n" +
						"  options: [ { label: 'Foo', value: 'foo' } ], autocomplete: 'on',\n" +
						"  autofocus: 'true', disabled: 0, readonly: { t: true }, required: [],\n" +
						"  tabindex: 'foo'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'MultiSelector',\n" +
						"  options: [ { label: 'Foo', value: 'foo' } ],\n" +
						"  autocomplete: 'on',\n" +
						"  autofocus: 'true', // should be a boolean\n" +
						"  disabled: 0, // should be a boolean\n" +
						"  readonly: { t: true }, // should be a boolean\n" +
						"  required: [], // should be a boolean\n" +
						"  tabindex: 'foo' // should be a number\n" +
						"}",
				));

			it("fails if options missing", () =>
				expect(
					() =>
						expect(
							{
								name: "field1",
								type: "MultiSelector",
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'field1', type: 'MultiSelector' } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'field1',\n" +
						"  type: 'MultiSelector'\n" +
						"  // missing: options: ⨯ should be an array and\n" +
						"              ⨯ should have items satisfying { label: expect.it('to be a label'), value: expect.it('to be defined') }\n" +
						"              or\n" +
						"              ⨯ should equal []\n" +
						"}",
				));
		});

		describe("type 'LineLabel'", () => {
			it("passes with a name only", () =>
				expect(
					() =>
						expect({ name: "field1", type: "LineLabel" }, "to be a form field"),
					"not to throw",
				));
		});

		describe("type 'NumberInput'", () => {
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

			it("fails if general input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "NumberInput",
								autocomplete: "on",
								autofocus: "true",
								disabled: 0,
								readonly: { t: true },
								required: [],
								tabindex: "foo",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'NumberInput', autocomplete: 'on',\n" +
						"  autofocus: 'true', disabled: 0, readonly: { t: true }, required: [],\n" +
						"  tabindex: 'foo'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'NumberInput',\n" +
						"  autocomplete: 'on',\n" +
						"  autofocus: 'true', // should be a boolean\n" +
						"  disabled: 0, // should be a boolean\n" +
						"  readonly: { t: true }, // should be a boolean\n" +
						"  required: [], // should be a boolean\n" +
						"  tabindex: 'foo' // should be a number\n" +
						"}",
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

			it("fails if number input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "NumberInput",
								max: "200",
								min: [2],
								placeholder: null,
								step: NaN,
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'NumberInput', max: '200', min: [ 2 ],\n" +
						"  placeholder: null, step: NaN\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'NumberInput',\n" +
						"  max: '200', // should be a number\n" +
						"  min: [ 2 ], // should be a number\n" +
						"  placeholder: null, // should be a number\n" +
						"  step: NaN // expected NaN to be a number\n" +
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

			it("fails if general input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "Selector",
								options: [{ label: "Foo", value: "foo" }],
								autocomplete: "on",
								autofocus: "true",
								disabled: 0,
								readonly: { t: true },
								required: [],
								tabindex: "foo",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'Selector',\n" +
						"  options: [ { label: 'Foo', value: 'foo' } ], autocomplete: 'on',\n" +
						"  autofocus: 'true', disabled: 0, readonly: { t: true }, required: [],\n" +
						"  tabindex: 'foo'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'Selector',\n" +
						"  options: [ { label: 'Foo', value: 'foo' } ],\n" +
						"  autocomplete: 'on',\n" +
						"  autofocus: 'true', // should be a boolean\n" +
						"  disabled: 0, // should be a boolean\n" +
						"  readonly: { t: true }, // should be a boolean\n" +
						"  required: [], // should be a boolean\n" +
						"  tabindex: 'foo' // should be a number\n" +
						"}",
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
		});

		describe("type 'SmallButton'", () => {
			it("passes with a name and button attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "SmallButton",
								primary: true,
								active: true,
								altText: {
									id: "test.button.label",
									defaultMessage: "Label",
								},
								icon: "an-icon",
								autofocus: true,
								disabled: true,
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if missing icon or altText", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "SmallButton",
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'Field1', type: 'SmallButton' } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'SmallButton'\n" +
						"  // missing: altText:\n" +
						"                should be a label\n" +
						"                  should be a string\n" +
						"  // missing: icon: should be a string\n" +
						"}",
				));

			it("fails if button attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "SmallButton",
								primary: "foo",
								active: 0,
								altText: { defaultMessage: "A label" },
								icon: [],
								autofocus: {},
								disabled: "!true",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'SmallButton', primary: 'foo', active: 0,\n" +
						"  altText: { defaultMessage: 'A label' }, icon: [], autofocus: {},\n" +
						"  disabled: '!true'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'SmallButton',\n" +
						"  primary: 'foo', // should be a boolean\n" +
						"  active: 0, // should be a boolean\n" +
						"  altText:\n" +
						"    { defaultMessage: 'A label' }, // should be a label\n" +
						"                                   //   should satisfy\n" +
						"                                   //   {\n" +
						"                                   //     id: expect.it('to be a string'),\n" +
						"                                   //     defaultMessage: expect.it('to be a string')\n" +
						"                                   //   }\n" +
						"                                   //\n" +
						"                                   //   {\n" +
						"                                   //     defaultMessage: 'A label'\n" +
						"                                   //     // missing: id: should be a string\n" +
						"                                   //   }\n" +
						"  icon: [], // should be a string\n" +
						"  autofocus: {}, // should be a boolean\n" +
						"  disabled: '!true' // should be a boolean\n" +
						"}",
				));
		});

		describe("type 'SwitchInput'", () => {
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

			it("fails if non-textual input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "SwitchInput",
								autofocus: "true",
								disabled: 1,
								required: [],
								tabindex: "",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'SwitchInput', autofocus: 'true', disabled: 1,\n" +
						"  required: [], tabindex: ''\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'SwitchInput',\n" +
						"  autofocus: 'true', // should be a boolean\n" +
						"  disabled: 1, // should be a boolean\n" +
						"  required: [], // should be a boolean\n" +
						"  tabindex: '' // should be a number\n" +
						"}",
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

			it("fails if switch input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "SwitchInput",
								onCaption: 1,
								offCaption: {},
								onColor: ["red"],
								offColor: 0,
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'SwitchInput', onCaption: 1, offCaption: {},\n" +
						"  onColor: [ 'red' ], offColor: 0\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'SwitchInput',\n" +
						"  onCaption:\n" +
						"    1, // should be a label\n" +
						"       //   should be a string\n" +
						"  offCaption:\n" +
						"    {}, // should be a label\n" +
						"        //   should satisfy\n" +
						"        //   {\n" +
						"        //     id: expect.it('to be a string'),\n" +
						"        //     defaultMessage: expect.it('to be a string')\n" +
						"        //   }\n" +
						"        //\n" +
						"        //   {\n" +
						"        //     // missing: id: should be a string\n" +
						"        //     // missing: defaultMessage: should be a string\n" +
						"        //   }\n" +
						"  onColor: [ 'red' ], // should be a string\n" +
						"  offColor: 0 // should be a string\n" +
						"}",
				));
		});

		describe("type 'TextInput'", () => {
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

			it("fails if general input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TextInput",
								autocomplete: "on",
								autofocus: "true",
								disabled: 0,
								readonly: { t: true },
								required: [],
								tabindex: "foo",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'TextInput', autocomplete: 'on',\n" +
						"  autofocus: 'true', disabled: 0, readonly: { t: true }, required: [],\n" +
						"  tabindex: 'foo'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'TextInput',\n" +
						"  autocomplete: 'on',\n" +
						"  autofocus: 'true', // should be a boolean\n" +
						"  disabled: 0, // should be a boolean\n" +
						"  readonly: { t: true }, // should be a boolean\n" +
						"  required: [], // should be a boolean\n" +
						"  tabindex: 'foo' // should be a number\n" +
						"}",
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

			it("fails if text input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TextInput",
								maxlength: 0,
								minlength: "three",
								pattern: {},
								placeholder: ["Placeholder here"],
								size: -15,
								spellcheck: null,
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'TextInput', maxlength: 0, minlength: 'three',\n" +
						"  pattern: {}, placeholder: [ 'Placeholder here' ], size: -15,\n" +
						"  spellcheck: null\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'TextInput',\n" +
						"  maxlength:\n" +
						"    0, // ✓ should be a number and\n" +
						"       // ⨯ should be greater than 0\n" +
						"  minlength:\n" +
						"    'three', // ⨯ should be a number and\n" +
						"             // ⨯ should be greater than 0\n" +
						"  pattern: {}, // should be a regular expression\n" +
						"  placeholder: [ 'Placeholder here' ], // should be a string\n" +
						"  size: -15, // ✓ should be a number and\n" +
						"             // ⨯ should be greater than 0\n" +
						"  spellcheck:\n" +
						"    null // ⨯ should be a boolean or\n" +
						"         // ⨯ should be ''\n" +
						"}",
				));
		});

		describe("type 'TimeInput'", () => {
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

			it("fails if general input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TimeInput",
								autocomplete: "on",
								autofocus: "true",
								disabled: 0,
								readonly: { t: true },
								required: [],
								tabindex: "foo",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'TimeInput', autocomplete: 'on',\n" +
						"  autofocus: 'true', disabled: 0, readonly: { t: true }, required: [],\n" +
						"  tabindex: 'foo'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'TimeInput',\n" +
						"  autocomplete: 'on',\n" +
						"  autofocus: 'true', // should be a boolean\n" +
						"  disabled: 0, // should be a boolean\n" +
						"  readonly: { t: true }, // should be a boolean\n" +
						"  required: [], // should be a boolean\n" +
						"  tabindex: 'foo' // should be a number\n" +
						"}",
				));

			it("passes with a name and time input attributes", () =>
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

			it("fails if time input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TimeInput",
								max: "15-35",
								min: "aaaa:21:05",
								step: "none",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'TimeInput',\n" +
						"  max: '15-35',\n" +
						"  min: 'aaaa:21:05',\n" +
						"  step: 'none'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'TimeInput',\n" +
						"  max: '15-35', // ✓ should be a string and\n" +
						"                // ⨯ should match /^\\d{2}:\\d{2}(?::\\d{2})?$/\n" +
						"  min: 'aaaa:21:05', // ✓ should be a string and\n" +
						"                     // ⨯ should match /^\\d{2}:\\d{2}(?::\\d{2})?$/\n" +
						"  step: 'none' // ⨯ should be a number or\n" +
						"               // ⨯ should be 'any'\n" +
						"               //\n" +
						"               //   -none\n" +
						"               //   +any\n" +
						"}",
				));
		});

		describe("type 'TranslationInput'", () => {
			it("passes with a name and 'more' label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TranslationInput",
								moreLabel: "More",
							},
							"to be a form field",
						),
					"not to throw",
				));

			it("fails if missing 'more' label", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TranslationInput",
							},
							"to be a form field",
						),
					"to throw",
					"expected { name: 'Field1', type: 'TranslationInput' } to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'TranslationInput'\n" +
						"  // missing: moreLabel:\n" +
						"                should be a label\n" +
						"                  should be a string\n" +
						"}",
				));

			it("passes with a name and general input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TranslationInput",
								moreLabel: "More",
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

			it("fails if general input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TranslationInput",
								moreLabel: "More",
								autocomplete: "on",
								autofocus: "true",
								disabled: 0,
								readonly: { t: true },
								required: [],
								tabindex: "foo",
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'TranslationInput', moreLabel: 'More',\n" +
						"  autocomplete: 'on', autofocus: 'true', disabled: 0,\n" +
						"  readonly: { t: true }, required: [], tabindex: 'foo'\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'TranslationInput',\n" +
						"  moreLabel: 'More',\n" +
						"  autocomplete: 'on',\n" +
						"  autofocus: 'true', // should be a boolean\n" +
						"  disabled: 0, // should be a boolean\n" +
						"  readonly: { t: true }, // should be a boolean\n" +
						"  required: [], // should be a boolean\n" +
						"  tabindex: 'foo' // should be a number\n" +
						"}",
				));

			it("passes with a name and text input attributes", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TranslationInput",
								moreLabel: "More",
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

			it("fails if text input attributes invalid", () =>
				expect(
					() =>
						expect(
							{
								name: "Field1",
								type: "TranslationInput",
								moreLabel: "More",
								maxlength: 0,
								minlength: "three",
								pattern: {},
								placeholder: ["Placeholder here"],
								size: -15,
								spellcheck: null,
							},
							"to be a form field",
						),
					"to throw",
					"expected\n" +
						"{\n" +
						"  name: 'Field1', type: 'TranslationInput', moreLabel: 'More',\n" +
						"  maxlength: 0, minlength: 'three', pattern: {},\n" +
						"  placeholder: [ 'Placeholder here' ], size: -15, spellcheck: null\n" +
						"}\n" +
						"to be a form field\n" +
						"\n" +
						"{\n" +
						"  name: 'Field1',\n" +
						"  type: 'TranslationInput',\n" +
						"  moreLabel: 'More',\n" +
						"  maxlength:\n" +
						"    0, // ✓ should be a number and\n" +
						"       // ⨯ should be greater than 0\n" +
						"  minlength:\n" +
						"    'three', // ⨯ should be a number and\n" +
						"             // ⨯ should be greater than 0\n" +
						"  pattern: {}, // should be a regular expression\n" +
						"  placeholder: [ 'Placeholder here' ], // should be a string\n" +
						"  size: -15, // ✓ should be a number and\n" +
						"             // ⨯ should be greater than 0\n" +
						"  spellcheck:\n" +
						"    null // ⨯ should be a boolean or\n" +
						"         // ⨯ should be ''\n" +
						"}",
				));
		});
	});

	describe("<object> to be a form combination field", () => {
		it("passes with a list of fields", () =>
			expect(
				() =>
					expect(
						{
							type: "Combination",
							fields: [
								{
									name: "labelA",
									type: "LineLabel",
								},
								{
									name: "fieldA",
									type: "TextInput",
								},
							],
						},
						"to be a form combination field",
					),
				"not to throw",
			));

		it("fails if missing type", () =>
			expect(
				() =>
					expect(
						{
							fields: [
								{
									name: "labelA",
									type: "LineLabel",
								},
								{
									name: "fieldA",
									type: "TextInput",
								},
							],
						},
						"to be a form combination field",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  fields: [\n" +
					"    { name: 'labelA', type: 'LineLabel' },\n" +
					"    { name: 'fieldA', type: 'TextInput' }\n" +
					"  ]\n" +
					"}\n" +
					"to be a form combination field\n" +
					"\n" +
					"{\n" +
					"  fields: [\n" +
					"    { name: 'labelA', type: 'LineLabel' },\n" +
					"    { name: 'fieldA', type: 'TextInput' }\n" +
					"  ]\n" +
					"  // missing type: 'Combination'\n" +
					"}",
			));

		it("fails if field list missing", () =>
			expect(
				() => expect({ type: "Combination" }, "to be a form combination field"),
				"to throw",
				"expected { type: 'Combination' } to be a form combination field\n" +
					"\n" +
					"{\n" +
					"  type: 'Combination'\n" +
					"  // missing: fields: ⨯ should be an array and\n" +
					"              ⨯ should have items satisfying 'to be a form field'\n" +
					"}",
			));

		it("fails if field list empty", () =>
			expect(
				() =>
					expect(
						{ type: "Combination", fields: [] },
						"to be a form combination field",
					),
				"to throw",
				"expected { type: 'Combination', fields: [] } to be a form combination field\n" +
					"\n" +
					"{\n" +
					"  type: 'Combination',\n" +
					"  fields:\n" +
					"    [] // ✓ should be an array and\n" +
					"       // ⨯ should have items satisfying to be a form field\n" +
					"       //     should not be empty\n" +
					"}",
			));

		it("passes with a list of fields and proportions", () =>
			expect(
				() =>
					expect(
						{
							type: "Combination",
							fields: [
								{
									name: "labelA",
									type: "LineLabel",
								},
								{
									name: "fieldA",
									type: "TextInput",
								},
							],
							proportions: ["50px", 90],
						},
						"to be a form combination field",
					),
				"not to throw",
			));

		it("passes if proportions shorter than fields", () =>
			expect(
				() =>
					expect(
						{
							type: "Combination",
							fields: [
								{
									name: "labelA",
									type: "LineLabel",
								},
								{
									name: "fieldA",
									type: "TextInput",
								},
							],
							proportions: ["50px"],
						},
						"to be a form combination field",
					),
				"not to throw",
			));

		it("fails if proportions longer than fields", () =>
			expect(
				() =>
					expect(
						{
							type: "Combination",
							fields: [
								{
									name: "labelA",
									type: "LineLabel",
								},
								{
									name: "fieldA",
									type: "TextInput",
								},
							],
							proportions: ["50px", 90, 10],
						},
						"to be a form combination field",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  type: 'Combination',\n" +
					"  fields: [\n" +
					"    { name: 'labelA', type: 'LineLabel' },\n" +
					"    { name: 'fieldA', type: 'TextInput' }\n" +
					"  ],\n" +
					"  proportions: [ '50px', 90, 10 ]\n" +
					"}\n" +
					"to be a form combination field\n" +
					"\n" +
					"{\n" +
					"  type: 'Combination',\n" +
					"  fields: [\n" +
					"    { name: 'labelA', type: 'LineLabel' },\n" +
					"    { name: 'fieldA', type: 'TextInput' }\n" +
					"  ],\n" +
					"  proportions:\n" +
					"    [ '50px', 90, 10 ] // ✓ should be an array and\n" +
					"                       // ⨯ should be shorter than or same length as\n" +
					"                       //   [\n" +
					"                       //     { name: 'labelA', type: 'LineLabel' },\n" +
					"                       //     { name: 'fieldA', type: 'TextInput' }\n" +
					"                       //   ]\n" +
					"}",
			));
	});
});
