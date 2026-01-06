const config = {
	useTabs: true,
	tabWidth: 2,
	trailingComma: "all",
	printWidth: 120,
	arrowParens: "avoid",
	endOfLine: "auto",
	semi: true,
	overrides: [
		{
			files: ["./src/translations/*.json"],
			options: {
				plugins: ["prettier-plugin-sort-json"],
			},
		},
	],
};

export default config;
