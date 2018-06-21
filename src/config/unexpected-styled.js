const ReactTestUtils = require("react-dom/test-utils");

module.exports = {
	name: "unexpected-styled",
	version: "0.0.1",
	dependencies: "unexpected-react",
	installInto: function(expect) {
		expect
			.addType({
				name: "RenderedSCElement",
				base: "RenderedReactElement",
				identify: function(value) {
					return value && value.state && value.state.generatedClassName;
				},
			})
			.addAssertion(
				"<RenderedReactElement> finding first styled component <assertion?>",
				function(expect, element) {
					expect.errorMode = "nested";
					let styledElements;
					try {
						styledElements = ReactTestUtils.findAllInRenderedTree(
							element,
							comp => comp && comp.state && comp.state.generatedClassName,
						);
					} catch (e) {
						expect.fail(e);
					}
					if (styledElements.length < 1) {
						expect.fail("No styled component was found in {0}", element);
					}
					return expect.shift(styledElements[0]);
				},
			)
			.addAssertion(
				"<string> as a selector to have style rules <assertion?>",
				function(expect, selector) {
					expect.errorMode = "nested";
					const sheets = document.querySelectorAll("style");
					let declarations = "";
					for (let j = 0; j < sheets.length; j += 1) {
						const sheet = sheets[j].sheet;
						for (let i = 0; i < sheet.cssRules.length; i += 1) {
							const ruleSelector = sheet.cssRules[i].selectorText || "";
							if (ruleSelector.indexOf(selector) !== -1) {
								declarations += sheet.cssRules[i].cssText;
							}
						}
					}
					return expect.shift(declarations);
				},
			)
			.addAssertion(
				"<RenderedSCElement> when extracting style rules <assertion?>",
				function(expect, element, ...assertion) {
					expect.errorMode = "nested";
					return expect(
						"." + element.state.generatedClassName,
						"as a selector to have style rules",
						...assertion,
					);
				},
			)
			.addAssertion(
				"<ReactElement> to render style rules <assertion?>",
				function(expect, element, ...assertion) {
					expect.errorMode = "nested";
					return expect(
						element,
						"when deeply rendered",
						"finding first styled component",
						"when extracting style rules",
						...assertion,
					);
				},
			);
	},
};
