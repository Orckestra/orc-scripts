# Script and dependency toolbox for Orckestra web applications

[![Build Status](https://travis-ci.org/Orckestra/orc-scripts.svg?branch=master)](https://travis-ci.org/Orckestra/orc-scripts) [![Coverage Status](https://coveralls.io/repos/github/Orckestra/orc-scripts/badge.svg?branch=master)](https://coveralls.io/github/Orckestra/orc-scripts?branch=master)

This package contains a standard set of dependencies and tooling for web applications. It is based on [`kcd-scripts`](https://github.com/kentcdodds/kcd-scripts) (copyright &copy; 2017 Kent C. Dodds, licensed via MIT License) in both concept and code.

## Installation and use

Installing this package is done via npm: `npm install orc-scripts`. This will also install the dependency set provided.

### Scripts

Where one exists, these scripts are intended to perform the role of the eponymous `npm` script. The scripts are invoked by running `orc-scripts <script> <options>`.

`prep`: Sets up for the build script (below). This creates the `dist/` directory and copies `src/content/` to `dist/content/` and `src/__mocks__/` to `dist/__mocks__/` as and if they exist. If not production building, also copies any files in `src/static` to `dist/`.

`build`: Runs the build process, creating the distribution files for the package. This is typically used for preparing a release. Adding the `--watch` option starts a watch for file changes, rebuilding when a source file changes. This is useful for developing in a linked library. For web apps, this will use Webpack, for libraries, it uses Babel. Expects to have `prep` (above) run before it.

`start`: Starts a web server locally, with hot module reloading enabled. Intended to support development work. You may set a specific port using the `--port <port>` option, or with the `PORT` environment variable. If a `HOST` environment variable is supplied, it will set up as an HTTPS server, expecting to be accessed at that hostname. Expects to have `prep` (above) run before it.

`test`: Starts the Jest test runner in watch mode. This will run and rerun all tests relating to files changed from the git HEAD by default. Adding the `--no-watch` option instead runs all tests once and exits. The `--coverage` option generates a code coverage report for the test suite under `coverage/`. Jest command-line options are in general applicable.

`extract-messages`: Searches through all JS files in the `src/` directory, extracting any `react-intl` messages found. It creates JSON files under `src/translations/` with all keys, using default values to populate the default language (by default the first supported locale). Other languages are left empty. Existing keys are not changed. Use this to ensure that translations are made. This script requires the presence of a `.babelrc` file; the simplest way to solve this is to create a `.babelrc.js` file containing only `module.exports = require("orc-scripts/babel");`.

`tag`: Creates a version tag and commit (using the `npm version` command) fitting the current branch and commit. Tags follow the following rules:

- The `develop` branch and branches starting with `feature` will be given a pre-release tag of `dev` - as in `v1.2.45-dev.3`.
- Branches beginning with `release/v` will be version-incremented according to branch name and given a pre-release tag of `pre`, ex. `v1.1.2-pre.1` from branch `release/v1.1.2`.
- Branches prefixed with `legacy/` will have a standard version number according to the branch name suffixed with `+legacy`.
- The `master` brannch will not be tagged, this should be done manually. This branch should be the only place clean versions (i.e. tag matching `/^v\d+\.\d+\.\d+$/`) are tagged.

`getDist`: Used by deployment scripts to determine the npm dist-tag to use for the package. This uses the tag names created by `orc-scripts tag` and sets dist-tag to `dev` for development tags, `beta` for pre-release tags, `previous` for legacy tags, and `latest` for clean version tags. This script only outputs the string name of the dist-tag to console, nothing else.

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
