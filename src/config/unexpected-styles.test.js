import React from "react";

describe("Styled component plugin for unexpected", () => {
	let firstSheet, secondSheet;
	beforeEach(() => {
		firstSheet = document.createElement("style");
		firstSheet.appendChild(document.createTextNode(""));
		document.head.appendChild(firstSheet);
		const sheet = firstSheet.sheet;
		sheet.insertRule("html { margin: 0; }", 0);
		sheet.insertRule("body { padding: 0; }", 1);
		sheet.insertRule(".foo { color: green; }", 2);
		secondSheet = document.createElement("style");
		secondSheet.appendChild(document.createTextNode(""));
		document.head.appendChild(secondSheet);
		secondSheet.sheet.insertRule(".bar { color: blue; }", 0);
	});
	afterEach(() => {
		document.head.removeChild(firstSheet);
		document.head.removeChild(secondSheet);
	});

	describe("<string> as a selector to have style rules <assertion?>", () => {
		it("passes when a style matches", () => expect(".foo", "as a selector to have style rules", "to contain", "green"));

		it("works with html tag", () => expect("html", "as a selector to have style rules", "to contain", "margin"));

		it("works with body tag", () => expect("body", "as a selector to have style rules", "to contain", "padding"));

		it("works on a second style sheet", () =>
			expect(".bar", "as a selector to have style rules", "to contain", "color: blue;"));

		it("gives a decent diff", () =>
			expect(
				() => expect(".foo", "as a selector to have style rules", "to contain", "width"),
				"to throw",
				"expected '.foo' as a selector to have style rules to contain 'width'\n\n.foo {color: green;}",
			));
	});

	describe("<DOMElement> to have style rules satisfying <assertion>", () => {
		it("passes with DOM element", () =>
			expect(
				<div className="ban foo boof" />,
				"when mounted",
				"to have style rules satisfying",
				"to contain",
				"color: green;",
			));

		it("passes with DOM element referencing second style sheet", () =>
			expect(
				<div className="ban bar boof" />,
				"when mounted",
				"to have style rules satisfying",
				"to contain",
				"color: blue;",
			));

		it("fails if no class name", () =>
			expect(
				() => expect(<div id="foo" />, "when mounted", "to have style rules satisfying", "to be ok"),
				"to throw",
				'expected <div id="foo"></div> to have style rules satisfying to be ok\n' +
					'  <div id="foo"></div> has no class name',
			));

		it("fails if empty class name", () =>
			expect(
				() => expect(<div id="foo" className="" />, "when mounted", "to have style rules satisfying", "to be a string"),
				"to throw",
				'expected <div id="foo" class=""></div>\n' +
					"to have style rules satisfying to be a string\n" +
					'  <div id="foo" class=""></div> has no class name',
			));
	});
});
