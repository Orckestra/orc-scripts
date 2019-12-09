import React from "react";
import styled from "styled-components";

const TestStyled = styled.div`
	color: red;
`;
// class TestComp extends React.Component {
// 	render() {
// 		return (
// 			<div>
// 				<TestStyled />
// 			</div>
// 		);
// 	}
// }

describe("Styled component plugin for unexpected", () => {
	it("<string> as a selector to have style rules <assertion?>", () => {
		const sheet = document.styleSheets[0];
		sheet.insertRule(".foo { color: green }");
		const assertion = expect(
			".foo",
			"as a selector to have style rules",
			"to contain",
			"green",
		);
		sheet.deleteRule(0);
		return assertion;
	});

	it("<DOMElement> to have style rules satisfying <assertion>", () =>
		expect(
			<TestStyled />,
			"when mounted",
			"to have style rules satisfying",
			expect.it("to be a", "string").and("to contain", "color: red;"),
		));

	it("<DOMElement> to have style rules satisfying <assertion> - fails if no class name", () =>
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
});
