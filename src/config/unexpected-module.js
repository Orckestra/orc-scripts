module.exports = {
	name: "unexpected-module",
	installInto: function (expect) {
		expect
			.addAssertion("<object> to be a component", function (expect, subject) {
				return expect(
					subject,
					expect.it("to have property", "$$typeof", Symbol.for("react.memo")).or("to be a function"),
				);
			})
			.addAssertion("<any> to be a component", function (expect) {
				return expect.fail();
			})
			.addAssertion("<object> to be a subpage", function (expect, subject) {
				const pattern = {
					component: expect.it("to be a component"),
				};
				if (subject.toolStateSelector) {
					pattern.toolStateSelector = expect.it("to be a function");
				}
				if (subject.toolFuncSelector) {
					pattern.toolFuncSelector = expect.it("to be a function");
				}
				expect(subject, "to exhaustively satisfy", pattern);
			})
			.addAssertion("<object> to be a segment", function (expect, subject) {
				const pattern = {
					label: expect.it("to be a label"),
					component: expect.it("to be a component"),
				};
				if (subject.dataPath) {
					pattern.label = expect.it("to be an object").and("to be a label");
					pattern.dataPath = expect
						.it("to be an array")
						.and("to have items satisfying", expect.it("to be a string").or("to be a number"));
					if (subject.dataIdParam) {
						pattern.dataIdParam = expect.it("to match", /^\w+$/);
					}
				}
				if (subject.pages) {
					pattern.pages = expect.it("to be a page list");
				}
				if (subject.subpages) {
					pattern.subpages = expect.it("to be a subpage list");
				}
				expect(subject, "to exhaustively satisfy", pattern);
			})
			.addAssertion("<object> to be a page", function (expect, subject) {
				expect.errorMode = "bubble";
				if (subject.dataPath) {
					const pattern = {
						label: expect.it("to be an object").and("to be a label"),
						dataPath: expect
							.it("to be an array")
							.and("to have items satisfying", expect.it("to be a string").or("to be a number")),
					};
					if (subject.dataIdParam) {
						pattern.dataIdParam = expect.it("to match", /^\w+$/);
					}
					expect(subject, "to satisfy", pattern);
				} else {
					expect(subject, "to satisfy", {
						label: expect.it("to be a label"),
					});
				}
				if (subject.component) {
					expect(subject, "to satisfy", {
						component: expect.it("to be a component"),
					});
					if (subject.pages) {
						expect(subject, "to satisfy", {
							pages: expect.it("to be a page list"),
						});
					}
					if (subject.subpages) {
						expect(subject, "to satisfy", {
							subpages: expect.it("to be a subpage list"),
						});
					}
					expect(subject, "not to have key", "segments");
				} else {
					expect(subject, "to satisfy", {
						segments: expect.it("to be a segment list"),
					});
					expect(subject, "not to have key", "pages");
					expect(subject, "not to have key", "subpages");
				}
			})
			.addAssertion("<object> to be a subpage list", function (expect, subject) {
				expect(subject, "to have keys satisfying", "to start with", "/");
				expect(subject, "to have values satisfying", "to be a subpage");
			})
			.addAssertion("<object> to be a segment list", function (expect, subject) {
				expect(subject, "to have keys satisfying", "to start with", "/");
				expect(subject, "to have values satisfying", "to be a segment");
			})
			.addAssertion("<object> to be a page list", function (expect, subject) {
				expect(subject, "to have keys satisfying", "to start with", "/");
				expect(subject, "to have values satisfying", "to be a page");
			})
			.addAssertion("<object> to be a module structure", function (expect, subject) {
				expect(subject, "to have keys satisfying", "not to start with", "/");
				expect(
					subject,
					"to have values satisfying",
					expect.it("to be a page").and("to satisfy", {
						icon: expect.it("to be a string"),
					}),
				);
			});
	},
};
