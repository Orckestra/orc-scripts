# Scripts

Where one exists, these scripts are intended to perform the role of the eponymous `npm` script. The scripts can be invoked on the command line by running `orc-scripts <script> <parameters>`, via `npx` or in an npm script command in `package.json`.

## `prep`

Sets up for the build script (below). This creates the `dist/` directory and copies `src/content/` to `dist/content/` and `src/__mocks__/` to `dist/__mocks__/` as and if they exist. If not production building, also copies any files in `src/static` to `dist/`.

## `build`

Runs the build process, creating the distribution files for the package. This is typically used for preparing a release. Adding the `--watch` option starts a watch for file changes, rebuilding when a source file changes. This is useful for developing in a linked library. For web apps, this will use Webpack, for libraries, it uses Babel. Expects to have `prep` (above) run before it.

## `buildDep`

Parameters:

- A URL to the target repository, in a form `git` understands
- `--master`: Locks target to master branch
- `--release <version>`: Locks target to specified release branch

Checks out and builds, then tests the given git repository, with the current working directory installed as a dependency. This is useful for ensuring downstream compatibility between libraries, and is used in checking new library dependency upgrades in `orc-scripts` against `orc-shared`, for instance. By default, it will check against the `develop` branch of the target library, unless the current git branch is `master` or the `--master` switch is set, in which case it checks against the `master` branch of the target library, or unless the `--release <version>` option is used, in which case a release branch is targeted - e.g. `--release v0.8` targets the `release/v0.8` branch of the target repository.

## `start`

Parameters:

- `--port <number>`: Sets the listening port for the development server

Starts a web server locally, with hot module reloading enabled. Intended to support development work. You may set a specific port using the `--port <port>` option, or with the `PORT` environment variable. If a `HOST` environment variable is supplied, it will set up as an HTTPS server, expecting to be accessed at that hostname. Expects to have `prep` (above) run before it.

## `test`

Parameters:

- `--no-watch`: Disables watch mode
- `--coverage`: Runs and checks coverage of tests, then exits
- Most Jest CLI options

Starts the Jest test runner in watch mode. This will run and rerun all tests relating to files changed from the git HEAD by default. Adding the `--no-watch` option instead runs all tests once and exits. The `--coverage` option generates a code coverage report for the test suite under `coverage/`. Jest command-line options are in general applicable.

## `extract-messages`

Searches through all JS files in the `src/` directory, extracting any `react-intl` messages found. It creates JSON files under `src/translations/` with all keys, using default values to populate the default language (by default the first supported locale). Other languages are left empty. Existing keys are not changed. Use this to ensure that translations are made. This script requires the presence of a `.babelrc` file; the simplest way to solve this is to create a `.babelrc.js` file containing only `module.exports = require("orc-scripts/babel");`.

## `tag`

Creates a version tag and commit (using the `npm version` command) fitting the current branch and commit. Tags follow the following rules:

- The `develop` branch and branches starting with `feature` will be given a pre-release tag of `dev` - as in `v1.2.45-dev.3`.
- Branches beginning with `release/v` will be version-incremented according to branch name and given a pre-release tag of `pre`, ex. `v1.1.2-pre.1` from branch `release/v1.1.2`.
- Branches prefixed with `legacy/` will have a standard version number according to the branch name suffixed with `+legacy`.
- The `master` brannch will not be tagged, this should be done manually. This branch should be the only place clean versions (i.e. tag matching `/^v\d+\.\d+\.\d+$/`) are tagged.

## `getDist`

Used by deployment scripts to determine the npm dist-tag to use for the package. This uses the tag names created by `orc-scripts tag` and sets dist-tag to `dev` for development tags, `beta` for pre-release tags, `previous` for legacy tags, and `latest` for clean version tags. This script itself only outputs the string name of the dist-tag to console.
