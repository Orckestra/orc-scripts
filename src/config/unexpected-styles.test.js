import React from "react";
import styled from "styled-components";

const TestStyled = styled.div`
	color: red;
	background-color: green;
`;

const SvgStyled = styled.svg`
	height: 10px;
	width: 100px;
`;

describe("Styled component plugin for unexpected", () => {
	let sheet, secondSheet;
	beforeEach(() => {
		sheet = document.styleSheets[0];
		sheet.insertRule("html { margin: 0; }", 0);
		sheet.insertRule("body { padding: 0; }", 1);
		sheet.insertRule(".foo { color: green; }", 2);
		secondSheet = document.createElement("style");
		secondSheet.appendChild(document.createTextNode(""));
		document.head.appendChild(secondSheet);
		secondSheet.sheet.insertRule(".bar { color: blue; }", 0);
	});
	afterEach(() => {
		sheet.deleteRule(2);
		sheet.deleteRule(1);
		sheet.deleteRule(0);
		document.head.removeChild(secondSheet);
	});

	describe("<string> as a selector to have style rules <assertion?>", () => {
		it("passes when a style matches", () =>
			expect(
				".foo",
				"as a selector to have style rules",
				"to contain",
				"green",
			));

		it("works with html tag", () =>
			expect(
				"html",
				"as a selector to have style rules",
				"to contain",
				"margin",
			));

		it("works with body tag", () =>
			expect(
				"body",
				"as a selector to have style rules",
				"to contain",
				"padding",
			));

		it("works on a second style sheet", () =>
			expect(
				".bar",
				"as a selector to have style rules",
				"to contain",
				"color: blue;",
			));

		it("gives a decent diff", () =>
			expect(
				() =>
					expect(
						".foo",
						"as a selector to have style rules",
						"to contain",
						"width",
					),
				"to throw",
				"expected '.foo' as a selector to have style rules to contain 'width'\n" +
					"\n" +
					".foo {color: green;}",
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

		it("passes with SVG element", () =>
			expect(
				<SvgStyled />,
				"when mounted",
				"to have style rules satisfying",
				expect.it("to be a", "string").and("to contain", "width: 100px;"),
			));

		it("passes with a styled component", () =>
			expect(
				<TestStyled />,
				"when mounted",
				"to have style rules satisfying",
				expect.it("to be a", "string").and("to contain", "color: red;"),
			));

		it("gives a detailed diff", () =>
			expect(
				() =>
					expect(
						<TestStyled />,
						"when mounted",
						"to have style rules satisfying",
						"to contain",
						"color: blue;",
					),
				"to throw",
				'expected <div class="unexpected-stylestest__TestStyled-waex4f-0 grRYoI"></div>\n' +
					"to have style rules satisfying to contain 'color: blue;'\n" +
					"  expected '.unexpected-stylestest__TestStyled-waex4f-0 {}\\n.grRYoI {color: red; background-color: green;}'\n" +
					"  to contain 'color: blue;'\n" +
					"\n" +
					"  .unexpected-stylestest__TestStyled-waex4f-0 {}\n" +
					"  .grRYoI {color: red; background-color: green;}\n" +
					"           ^^^^^^^                ^^^^^^^",
			));

		it("fails if no class name", () =>
			expect(
				() =>
					expect(
						<div id="foo" />,
						"when mounted",
						"to have style rules satisfying",
						"to be ok",
					),
				"to throw",
				'expected <div id="foo"></div> to have style rules satisfying to be ok\n' +
					'  <div id="foo"></div> has no class name',
			));

		it("fails if no class name", () =>
			expect(
				() =>
					expect(
						<div id="foo" className="" />,
						"when mounted",
						"to have style rules satisfying",
						"to be a string",
					),
				"to throw",
				'expected <div id="foo" class=""></div>\n' +
					"to have style rules satisfying to be a string\n" +
					'  <div id="foo" class=""></div> has no class name',
			));
	});
});
