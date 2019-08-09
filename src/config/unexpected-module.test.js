// import React from "react";

const FakeComponent = () => null;

const fakeSelector = () => {};

describe("Module structure plugin for Unexpected", () => {
	describe("<object> to be a subpage", () => {
		it("handles a minimal subpage", () =>
			expect(
				() => expect({ component: FakeComponent }, "to be a subpage"),
				"not to throw",
			));

		it("does not accept subpages with pages", () =>
			expect(
				() =>
					expect(
						{
							component: FakeComponent,
							pages: { "/foo": { component: FakeComponent, label: "A label" } },
						},
						"to be a subpage",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  pages: { '/foo': { component: ..., label: 'A label' } }\n" +
					"}\n" +
					"to be a subpage\n" +
					"\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  pages: { '/foo': { component: ..., label: 'A label' } } // should be removed\n" +
					"}",
			));

		it("does not accept subpages with segments", () =>
			expect(
				() =>
					expect(
						{
							component: FakeComponent,
							segments: {
								"/foo": { component: FakeComponent, label: "A label" },
							},
						},
						"to be a subpage",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  segments: { '/foo': { component: ..., label: 'A label' } }\n" +
					"}\n" +
					"to be a subpage\n" +
					"\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  segments: { '/foo': { component: ..., label: 'A label' } } // should be removed\n" +
					"}",
			));

		it("does not accept subpages with subpages", () =>
			expect(
				() =>
					expect(
						{
							component: FakeComponent,
							subpages: { "/foo": { component: FakeComponent } },
						},
						"to be a subpage",
					),
				"to throw",
				"expected { component: () => null, subpages: { '/foo': { component: ... } } }\n" +
					"to be a subpage\n" +
					"\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  subpages: { '/foo': { component: ... } } // should be removed\n" +
					"}",
			));

		it("throws error if no component", () =>
			expect(
				() => expect({ wrong_component: FakeComponent }, "to be a subpage"),
				"to throw",
				"expected { wrong_component: () => null } to be a subpage\n" +
					"\n" +
					"{\n" +
					"  wrong_component: () => null // should be removed\n" +
					"  // missing: component: should be a function\n" +
					"}",
			));

		it("handles a subpage with toolbar", () =>
			expect(
				() =>
					expect(
						{ component: FakeComponent, toolStateSelector: fakeSelector },
						"to be a subpage",
					),
				"not to throw",
			));

		it("throws if toolbar state selector not function", () =>
			expect(
				() =>
					expect(
						{ component: FakeComponent, toolStateSelector: "fakeSelector" },
						"to be a subpage",
					),
				"to throw",
				"expected { component: () => null, toolStateSelector: 'fakeSelector' }\n" +
					"to be a subpage\n" +
					"\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  toolStateSelector: 'fakeSelector' // should be a function\n" +
					"}",
			));

		it("handles a subpage with toolbar functions", () =>
			expect(
				() =>
					expect(
						{ component: FakeComponent, toolFuncSelector: fakeSelector },
						"to be a subpage",
					),
				"not to throw",
			));

		it("throws if toolbar function selector not function", () =>
			expect(
				() =>
					expect(
						{ component: FakeComponent, toolFuncSelector: "fakeSelector" },
						"to be a subpage",
					),
				"to throw",
				"expected { component: () => null, toolFuncSelector: 'fakeSelector' }\n" +
					"to be a subpage\n" +
					"\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  toolFuncSelector: 'fakeSelector' // should be a function\n" +
					"}",
			));
	});

	describe("<object> to be a subpage list", () => {
		it("passes when subject is an index of only subpages", () =>
			expect(
				() =>
					expect(
						{
							"/foo": { component: FakeComponent },
							"/bar": {
								component: FakeComponent,
								toolStateSelector: fakeSelector,
							},
						},
						"to be a subpage list",
					),
				"not to throw",
			));

		it("fails when subject has keys not starting with /", () =>
			expect(
				() =>
					expect(
						{
							foo: { component: FakeComponent },
							"/bar": {
								component: FakeComponent,
								toolStateSelector: fakeSelector,
							},
						},
						"to be a subpage list",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  foo: { component: () => null },\n" +
					"  '/bar': { component: () => null, toolStateSelector: () => {} }\n" +
					"}\n" +
					"to be a subpage list\n" +
					"\n" +
					"[\n" +
					"  'foo', // should start with '/'\n" +
					"  '/bar'\n" +
					"]",
			));

		it("fails when subject is an empty object", () =>
			expect(
				() => expect({}, "to be a subpage list"),
				"to throw",
				"expected {} to be a subpage list",
			));

		it("fails when subject contains something not a subpage", () =>
			expect(
				() =>
					expect(
						{
							"/foo": { component: FakeComponent },
							"/bar": {
								component: FakeComponent,
								toolStateSelector: "fakeSelector",
							},
						},
						"to be a subpage list",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  '/foo': { component: () => null },\n" +
					"  '/bar': { component: () => null, toolStateSelector: 'fakeSelector' }\n" +
					"}\n" +
					"to be a subpage list\n" +
					"\n" +
					"{\n" +
					"  '/foo': { component: () => null },\n" +
					"  '/bar': {\n" +
					"    component: () => null,\n" +
					"    toolStateSelector: 'fakeSelector' // should be a function\n" +
					"  }\n" +
					"}",
			));
	});

	describe("<object> to be a segment", () => {
		it("passes with a string label and component", () =>
			expect(
				() =>
					expect(
						{ component: FakeComponent, label: "A label" },
						"to be a segment",
					),
				"not to throw",
			));

		it("passes with an object label, component and subpage list", () =>
			expect(
				() =>
					expect(
						{
							component: FakeComponent,
							label: { id: "test.msg", defaultMessage: "A label" },
							subpages: {
								"/foo": { component: FakeComponent },
							},
						},
						"to be a segment",
					),
				"not to throw",
			));

		it("passes with a string label, component and page list", () =>
			expect(
				() =>
					expect(
						{
							component: FakeComponent,
							label: "A label",
							pages: {
								"/foo": { component: FakeComponent, label: "A label" },
								"/bar": {
									component: FakeComponent,
									label: { id: "test.msg", defaultMessage: "A label" },
									subpages: {
										"/foo": { component: FakeComponent },
									},
								},
							},
						},
						"to be a segment",
					),
				"not to throw",
			));

		it("fails with a segment list", () =>
			expect(
				() =>
					expect(
						{
							component: FakeComponent,
							label: "A label",
							segments: {
								"/foo": { component: FakeComponent, label: "A label" },
								"/bar": {
									component: FakeComponent,
									label: "A label",
								},
							},
						},
						"to be a segment",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  label: 'A label',\n" +
					"  segments: {\n" +
					"    '/foo': { component: ..., label: 'A label' },\n" +
					"    '/bar': { component: ..., label: 'A label' }\n" +
					"  }\n" +
					"}\n" +
					"to be a segment\n" +
					"\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  label: 'A label',\n" +
					"  segments: {\n" +
					"    '/foo': { component: ..., label: 'A label' },\n" +
					"    '/bar': { component: ..., label: 'A label' }\n" +
					"  } // should be removed\n" +
					"}",
			));

		it("fails if missing component", () =>
			expect(
				() =>
					expect(
						{
							label: { id: "test.msg", defaultMessage: "A label" },
							subpages: {
								"/foo": { component: FakeComponent },
							},
						},
						"to be a segment",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"  subpages: { '/foo': { component: ... } }\n" +
					"}\n" +
					"to be a segment\n" +
					"\n" +
					"{\n" +
					"  label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"  subpages: { '/foo': { component: ... } }\n" +
					"  // missing: component: should be a function\n" +
					"}",
			));

		it("fails if missing label", () =>
			expect(
				() =>
					expect(
						{
							component: FakeComponent,
							subpages: {
								"/foo": { component: FakeComponent },
							},
						},
						"to be a segment",
					),
				"to throw",
				"expected { component: () => null, subpages: { '/foo': { component: ... } } }\n" +
					"to be a segment\n" +
					"\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  subpages: { '/foo': { component: ... } }\n" +
					"  // missing: label: should be a label\n" +
					"}",
			));

		it("fails if label not correct", () =>
			expect(
				() =>
					expect(
						{
							component: FakeComponent,
							label: 3,
							subpages: {
								"/foo": { component: FakeComponent },
							},
						},
						"to be a segment",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  component: () => null, label: 3,\n" +
					"  subpages: { '/foo': { component: ... } }\n" +
					"}\n" +
					"to be a segment\n" +
					"\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  label: 3, // should be a label\n" +
					"  subpages: { '/foo': { component: ... } }\n" +
					"}",
			));

		it("fails if subpages not a subpage list", () =>
			expect(
				() =>
					expect(
						{
							component: FakeComponent,
							label: { id: "test.msg", defaultMessage: "A label" },
							subpages: {
								"/foo": { component: "FakeComponent" },
							},
						},
						"to be a segment",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"  subpages: { '/foo': { component: 'FakeComponent' } }\n" +
					"}\n" +
					"to be a segment\n" +
					"\n" +
					"{\n" +
					"  component: () => null,\n" +
					"  label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"  subpages:\n" +
					"    { '/foo': { component: 'FakeComponent' } }\n" +
					"    // should be a subpage list\n" +
					"    //\n" +
					"    // {\n" +
					"    //   '/foo': {\n" +
					"    //     component: 'FakeComponent' // should be a function\n" +
					"    //   }\n" +
					"    // }\n" +
					"}",
			));
	});

	describe("<object> to be a segment list", () => {
		it("passes when subject is an index of only segments", () =>
			expect(
				() =>
					expect(
						{
							"/foo": { component: FakeComponent, label: "A label" },
							"/bar": {
								component: FakeComponent,
								label: { id: "test.msg", defaultMessage: "A label" },
								subpages: {
									"/foo": { component: FakeComponent },
								},
							},
						},
						"to be a segment list",
					),
				"not to throw",
			));

		it("fails when subject has keys not starting with /", () =>
			expect(
				() =>
					expect(
						{
							foo: { component: FakeComponent, label: "A label" },
							"/bar": {
								component: FakeComponent,
								label: { id: "test.msg", defaultMessage: "A label" },
								subpages: {
									"/foo": { component: FakeComponent },
								},
							},
						},
						"to be a segment list",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  foo: { component: () => null, label: 'A label' },\n" +
					"  '/bar': {\n" +
					"    component: () => null,\n" +
					"    label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"    subpages: { '/foo': ... }\n" +
					"  }\n" +
					"}\n" +
					"to be a segment list\n" +
					"\n" +
					"[\n" +
					"  'foo', // should start with '/'\n" +
					"  '/bar'\n" +
					"]",
			));

		it("fails when subject is an empty object", () =>
			expect(
				() => expect({}, "to be a segment list"),
				"to throw",
				"expected {} to be a segment list",
			));

		it("fails when subject contains something not a segment", () =>
			expect(
				() =>
					expect(
						{
							"/foo": { component: FakeComponent, label: "A label" },
							"/bar": {
								label: { id: "test.msg", defaultMessage: "A label" },
								subpages: {
									"/foo": { component: FakeComponent },
								},
							},
						},
						"to be a segment list",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  '/foo': { component: () => null, label: 'A label' },\n" +
					"  '/bar': {\n" +
					"    label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"    subpages: { '/foo': ... }\n" +
					"  }\n" +
					"}\n" +
					"to be a segment list\n" +
					"\n" +
					"{\n" +
					"  '/foo': { component: () => null, label: 'A label' },\n" +
					"  '/bar': {\n" +
					"    label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"    subpages: { '/foo': { component: ... } }\n" +
					"    // missing: component: should be a function\n" +
					"  }\n" +
					"}",
			));
	});

	describe("<object> to be a page", () => {
		it("passes with a string label and component", () =>
			expect(
				() =>
					expect(
						{ component: FakeComponent, label: "A label" },
						"to be a page",
					),
				"not to throw",
			));

		it("passes with a label, component and subpage list", () =>
			expect(
				() =>
					expect(
						{
							label: { id: "test.msg", defaultMessage: "A label" },
							component: FakeComponent,
							subpages: {
								"/foo": { component: FakeComponent },
								"/bar": {
									component: FakeComponent,
									toolStateSelector: fakeSelector,
								},
							},
						},
						"to be a page",
					),
				"not to throw",
			));

		it("passes with a label, component and page list", () =>
			expect(
				() =>
					expect(
						{
							label: { id: "test.msg", defaultMessage: "A label" },
							component: FakeComponent,
							pages: {
								"/foo": { component: FakeComponent, label: "A label" },
								"/bar": {
									component: FakeComponent,
									label: { id: "test.msg", defaultMessage: "A label" },
									subpages: {
										"/foo": { component: FakeComponent },
									},
								},
							},
						},
						"to be a page",
					),
				"not to throw",
			));

		it("passes with a string label and segment list", () =>
			expect(
				() =>
					expect(
						{
							label: "A label",
							segments: {
								"/foo": { component: FakeComponent, label: "A label" },
								"/bar": {
									component: FakeComponent,
									label: "A label",
								},
							},
						},
						"to be a page",
					),
				"not to throw",
			));

		it("passes with an object label and segment list", () =>
			expect(
				() =>
					expect(
						{
							label: { id: "test.msg", defaultMessage: "A label" },
							segments: {
								"/foo": { component: FakeComponent, label: "A label" },
								"/bar": {
									component: FakeComponent,
									label: "A label",
								},
							},
						},
						"to be a page",
					),
				"not to throw",
			));

		it("fails with a component and segment list", () =>
			expect(
				() =>
					expect(
						{
							label: { id: "test.msg", defaultMessage: "A label" },
							component: FakeComponent,
							segments: {
								"/foo": { component: FakeComponent, label: "A label" },
								"/bar": {
									component: FakeComponent,
									label: "A label",
								},
							},
						},
						"to be a page",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"  component: () => null,\n" +
					"  segments: {\n" +
					"    '/foo': { component: ..., label: 'A label' },\n" +
					"    '/bar': { component: ..., label: 'A label' }\n" +
					"  }\n" +
					"}\n" +
					"not to have key 'segments'",
			));

		it("fails with a segment list and pages list", () =>
			expect(
				() =>
					expect(
						{
							label: "A label",
							segments: {
								"/foo": { component: FakeComponent, label: "A label" },
								"/bar": {
									component: FakeComponent,
									label: "A label",
								},
							},
							pages: {
								"/foo": { component: FakeComponent, label: "A label" },
								"/bar": {
									component: FakeComponent,
									label: "A label",
								},
							},
						},
						"to be a page",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  label: 'A label',\n" +
					"  segments: {\n" +
					"    '/foo': { component: ..., label: 'A label' },\n" +
					"    '/bar': { component: ..., label: 'A label' }\n" +
					"  },\n" +
					"  pages: {\n" +
					"    '/foo': { component: ..., label: 'A label' },\n" +
					"    '/bar': { component: ..., label: 'A label' }\n" +
					"  }\n" +
					"}\n" +
					"not to have key 'pages'",
			));

		it("passes with a segment list and subpage list", () =>
			expect(
				() =>
					expect(
						{
							label: "A label",
							segments: {
								"/foo": { component: FakeComponent, label: "A label" },
								"/bar": {
									component: FakeComponent,
									label: "A label",
								},
							},
							subpages: {
								"/foo": { component: FakeComponent },
								"/bar": {
									component: FakeComponent,
									toolStateSelector: fakeSelector,
								},
							},
						},
						"to be a page",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  label: 'A label',\n" +
					"  segments: {\n" +
					"    '/foo': { component: ..., label: 'A label' },\n" +
					"    '/bar': { component: ..., label: 'A label' }\n" +
					"  },\n" +
					"  subpages: {\n" +
					"    '/foo': { component: ... },\n" +
					"    '/bar': { component: ..., toolStateSelector: ... }\n" +
					"  }\n" +
					"}\n" +
					"not to have key 'subpages'",
			));
	});

	describe("<object> to be a page list", () => {
		it("passes when subject is an index of only pages", () =>
			expect(
				() =>
					expect(
						{
							"/foo": { component: FakeComponent, label: "A label" },
							"/bar": {
								component: FakeComponent,
								label: { id: "test.msg", defaultMessage: "A label" },
								subpages: {
									"/foo": { component: FakeComponent },
								},
							},
						},
						"to be a page list",
					),
				"not to throw",
			));

		it("fails when subject has keys not starting with /", () =>
			expect(
				() =>
					expect(
						{
							"/foo": { component: FakeComponent, label: "A label" },
							bar: {
								component: FakeComponent,
								label: { id: "test.msg", defaultMessage: "A label" },
								subpages: {
									"/foo": { component: FakeComponent },
								},
							},
						},
						"to be a page list",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  '/foo': { component: () => null, label: 'A label' },\n" +
					"  bar: {\n" +
					"    component: () => null,\n" +
					"    label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"    subpages: { '/foo': ... }\n" +
					"  }\n" +
					"}\n" +
					"to be a page list\n" +
					"\n" +
					"[\n" +
					"  '/foo',\n" +
					"  'bar' // should start with '/'\n" +
					"]",
			));

		it("fails when subject is an empty object", () =>
			expect(
				() => expect({}, "to be a page list"),
				"to throw",
				"expected {} to be a page list",
			));

		it("fails when subject contains something not a page", () =>
			expect(
				() =>
					expect(
						{
							"/foo": { component: FakeComponent, label: "A label" },
							"/bar": {
								component: FakeComponent,
								label: { id: "test.msg", defaultMessage: "A label" },
								segments: {
									"/foo": { component: FakeComponent, label: "A label" },
								},
							},
						},
						"to be a page list",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  '/foo': { component: () => null, label: 'A label' },\n" +
					"  '/bar': {\n" +
					"    component: () => null,\n" +
					"    label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"    segments: { '/foo': ... }\n" +
					"  }\n" +
					"}\n" +
					"to be a page list\n" +
					"\n" +
					"{\n" +
					"  '/foo': { component: () => null, label: 'A label' },\n" +
					"  '/bar': {\n" +
					"            component: () => null,\n" +
					"            label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"            segments: { '/foo': ... }\n" +
					"          }\n" +
					"          // should not have key 'segments'\n" +
					"}",
			));
	});

	describe("<object> to be a module structure", () => {
		it("passes when subject is an index of only pages with icons", () =>
			expect(
				() =>
					expect(
						{
							foo: {
								icon: "icon1",
								component: FakeComponent,
								label: "A label",
							},
							bar: {
								icon: "icon2",
								component: FakeComponent,
								label: { id: "test.msg", defaultMessage: "A label" },
								subpages: {
									"/foo": { component: FakeComponent },
								},
							},
						},
						"to be a module structure",
					),
				"not to throw",
			));

		it("fails when subject has keys starting with /", () =>
			expect(
				() =>
					expect(
						{
							"/foo": {
								icon: "icon1",
								component: FakeComponent,
								label: "A label",
							},
							bar: {
								icon: "icon2",
								component: FakeComponent,
								label: { id: "test.msg", defaultMessage: "A label" },
								subpages: {
									"/foo": { component: FakeComponent },
								},
							},
						},
						"to be a module structure",
					),
				"to throw",
				"expected\n" +
					"{\n" +
					"  '/foo': { icon: 'icon1', component: () => null, label: 'A label' },\n" +
					"  bar: {\n" +
					"    icon: 'icon2',\n" +
					"    component: () => null,\n" +
					"    label: { id: 'test.msg', defaultMessage: 'A label' },\n" +
					"    subpages: { '/foo': ... }\n" +
					"  }\n" +
					"}\n" +
					"to be a module structure\n" +
					"\n" +
					"[\n" +
					"  '/foo', // should not start with '/'\n" +
					"          //\n" +
					"          // /foo\n" +
					"          // ^\n" +
					"  'bar'\n" +
					"]",
			));
	});
});
