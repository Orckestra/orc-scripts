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
					const styledElements = ReactTestUtils.findAllInRenderedTree(
						element,
						comp => comp && comp.state && comp.state.generatedClassName,
					);
					return expect.shift(styledElements[0]);
				},
			)
			.addAssertion(
				"<RenderedSCElement> when extracting style text <assertion?>",
				function(expect, element) {
					const sheet = document.querySelector("style[data-styled-components]")
						.sheet;
					let i = 0,
						commandList = "";
					while (i < sheet.cssRules.length) {
						const selector = sheet.cssRules[i].selectorText;
						if (
							selector.indexOf("." + element.state.generatedClassName) !== -1
						) {
							commandList += sheet.cssRules[i].cssText;
						}
						i += 1;
					}
					return expect.shift(commandList);
				},
			)
			.addAssertion(
				"<ReactElement> to render style rules <assertion?>",
				function(expect, element, ...assertion) {
					return expect(
						element,
						"when deeply rendered",
						"finding first styled component",
						"when extracting style text",
						...assertion,
					);
				},
			);
	},
};
