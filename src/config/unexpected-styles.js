// const ReactTestUtils = require("react-dom/test-utils");

module.exports = {
	name: "unexpected-styles",
	version: "0.0.2",
	dependencies: ["unexpected-reaction", "unexpected-dom"],
	installInto: function (expect) {
		const getStyleDeclarations = selector => {
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
			return declarations;
		};

		expect.addAssertion("<string> as a selector to have style rules <assertion?>", function (expect, selector) {
			return expect.shift(getStyleDeclarations(selector));
		});

		expect.addAssertion(
			"<DOMElement> to have style rules satisfying <assertion>",
			function (expect, element, ...assertion) {
				expect.errorMode = "nested";
				const classes = element.getAttribute("class");
				if (!classes) {
					return expect.fail("{0} has no class name", element);
				}
				const styleRules = classes
					.split(" ")
					.map(sel => getStyleDeclarations("." + sel))
					.filter(Boolean)
					.join("\n");
				return expect.shift(styleRules);
			},
		);
	},
};
