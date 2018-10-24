import React from "react";
import styled from "styled-components";

const TestStyled = styled.div`
	color: red;
`;
class TestComp extends React.Component {
	render() {
		return (
			<div>
				<TestStyled />
			</div>
		);
	}
}

describe("Styled component plugin for unexpected", () => {
	it("<RenderedReactElement> finding first styled component <assertion?>", () =>
		expect(<TestComp />, "when deeply rendered")
			.then(elem => expect(elem, "finding first styled component"))
			.then(elem => expect(elem, "to be a", "RenderedSCElement")));

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

	it("<RenderedSCElement> when extracting style rules <assertion?>", () =>
		expect(<TestStyled />, "when deeply rendered")
			.then(elem => expect(elem, "when extracting style rules"))
			.then(styles =>
				expect(styles, "to be a", "string").and("to contain", "color: red;"),
			));

	it("<ReactElement> to render style rules <assertion?>", () =>
		expect(<TestComp />, "to render style rules").then(styles =>
			expect(styles, "to be a", "string").and("to contain", "color: red;"),
		));
});
