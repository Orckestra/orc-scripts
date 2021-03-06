# Orckestra Client Application Framework toolbox

![Build Status](https://dev.azure.com/orckestra001/OrckestraCommerce/_apis/build/status/FrontEnd/Framework/orc-scripts?branchName=develop) [![Coverage Status](https://coveralls.io/repos/github/Orckestra/orc-scripts/badge.svg?branch=master)](https://coveralls.io/github/Orckestra/orc-scripts?branch=master)

This package contains a standard set of dependencies and tooling for web applications. It is based on [`kcd-scripts`](https://github.com/kentcdodds/kcd-scripts) (copyright &copy; 2017 Kent C. Dodds, licensed via MIT License) in both concept and code.

## Installation and use

Installing this package is done via npm: `npm install orc-scripts`. This will also install the dependency set provided.

### Scripts

[Several scripts](docs/scripts.md) are provided to users.

The easiest way to use these scripts is to add entries to your package.json under "scripts", invoking the `orc-scripts` command. A typical "scripts" section might look like this:

```json
{
	"scripts": {
		"clean": "orc-scripts clean",
		"build": "orc-scripts prep && orc-scripts build",
		"start": "orc-scripts prep && orc-scripts start",
		"test": "orc-scripts test",
		"coverage": "orc-scripts test --coverage"
	}
}
```

### Code tools

The toolbox contains support for `eslint` and `prettier`, both for use with development tools (such as Atom or VS Code) and in git hooks. To integrate with your development tool of choice, ensure the suitable plugin is installed if applicable, and create a config file or `package.json` entry that points to the `orc-scripts` preset for that tool (`orc-scripts/eslint`, resp. `orc-scripts/prettier`).

To set up a git commit hook that runs `prettier` on all staged files, add the following section to `package.json`:

```json
{
	"husky": {
		"hooks": {
			"pre-commit": "lint-staged"
		}
	}
}
```

This will run the `lint-staged` tool whenever you commit files to git. Configure this tool with a section in your `package.json` as follows:

```json
{
	"lint-staged": {
		"linters": {
			"*.{js,json,md}": ["prettier --write", "git add"]
		},
		"ignore": ["package.json", "package-lock.json", "src/translations/*.json"]
	}
}
```

This instructs `lint-staged` to run `prettier` on staged files, rewriting the file to specifications, and then re-staging it for the commit. This ensures that all code in the app lives up to the strict standards set by `prettier`. It is recommended to not let it process `package.json`, `package-lock.json` and translation files, as these are automatically processed and changed. Prettier can be told to ignore these by adding a `.prettierignore` file using the same syntax as `.gitignore`.

### Testing

Testing with Jest and `unexpected` is built into the toolbox, allowing test setup to be as simple as adding a file with a `.test.js` suffix to your file tree. A number of [plugins and custom assertions](docs/assertions.md) are provided as well.

### Deploying

An application that employs code splitting (resulting in multiple output bundle files) and is to be deployed to a CDN will need to pass the CDN location to the entry bundle to ensure that further bundles are fetched from the right location. To do this, include a script in the header of the `index.html` file which sets `window.ASSET_PATH` to the CDN location (a slash-terminated url, i.e. `"https://foo.cdn.org/my-bundle/"`). This needs to be executed before the entry bundle.

## License

Copyright &copy; 2018 Orckestra Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
