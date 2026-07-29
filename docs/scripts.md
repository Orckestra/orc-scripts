# Scripts

Where one exists, these scripts are intended to perform the role of the eponymous `npm` script. The scripts can be invoked on the command line by running `orc-scripts <script> <parameters>`, via `npx` or in an npm script command in `package.json`.

## `prep`

Sets up for the build script (below). This creates the `dist/` directory and copies `src/content/` to `dist/content/` and `src/__mocks__/` to `dist/__mocks__/` as and if they exist. If not production building, also copies any files in `src/static` to `dist/`.

## `build`

Depending on build type - webpack or not - different parameters can be given.

Parameters for webpack builds (environment has `BUILD_WEBPACK=true`):

- `--stats`: Adds bundle analysis to the build using `webpack-bundle-analyzer`

Parameters for non-webpack builds:

- `--out-dir`: Sets output directory for build, default `./dist/`
- `--no-copy-files`: Prevents files being copied to output dir if they are not transpiled
- `--presets`:
- `--quiet`:
- `--ignore`:
- `--watch`: Starts watch mode, which will rebuild individual files when changed

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
- `--https`: Forces an HTTPS server even when `HOSTNAME` is not set

Starts a web server locally, with hot module reloading enabled. Intended to support development work. You may set a specific port using the `--port <port>` option, or with the `PORT` environment variable. If a `HOSTNAME` environment variable is supplied (and isn't `localhost`), or the `--https` flag or `HTTPS` environment variable is set, it will set up as an HTTPS server. Expects to have `prep` (above) run before it.

For the HTTPS case, `SSL_CERT_PATH` must point to either a `.pfx` file or a folder containing exactly one `.pfx` file. The certificate's passphrase is read from `SSL_CERT_PASSWORD` if set; otherwise the script walks up from the certificate's folder looking for a `parameters.dev.xml` file and extracts the passphrase from its `SSL_CertificatePfxPassword` parameter.

## `test`

Parameters:

- `--no-watch`: Disables watch mode
- `--coverage`: Runs and checks coverage of tests, then exits
- Most Jest CLI options

Starts the Jest test runner in watch mode. This will run and rerun all tests relating to files changed from the git HEAD by default. Adding the `--no-watch` option instead runs all tests once and exits. The `--coverage` option generates a code coverage report for the test suite under `coverage/`. Jest command-line options are in general applicable.

## `extract-messages`

Searches through all JS files in the `src/` directory, extracting any `react-intl` messages found. It creates JSON files under `src/translations/` with all keys, using default values to populate the default language (by default the first supported locale). Other languages are left empty. Existing keys are not changed. Use this to ensure that translations are made. This script requires the presence of a `.babelrc` file; the simplest way to solve this is to create a `.babelrc.js` file containing only `module.exports = require("orc-scripts/babel");`.

## `tag`

Creates a version tag and commit (using the `npm version` command) for the current branch and commit. Only runs on the `develop` branch or a branch starting with `version/` - it aborts on any other branch, if the working directory is not clean (i.e. there is a diff from `HEAD`), or if the resulting tag already exists. When it runs, it always bumps to a `-dev.N` prerelease, e.g. `v1.2.45-dev.3`.

The `master` branch is never tagged by this script - clean versions (tag matching `/^v\d+\.\d+\.\d+$/`) should only ever be tagged there, manually. `getDist` (below) also still recognizes `-pre` (pre-release/`beta`) and `+legacy` tag shapes from an older/manual tagging process (e.g. for `release/*`/`legacy/*` branches), even though this script no longer produces them itself.

## `getDist`

Used by deployment scripts to determine the npm dist-tag to use for the package. This looks at the current package version and sets dist-tag to `dev` for a `-dev` prerelease, `beta` for a `-pre` prerelease, `previous` for a version ending in `+legacy`, and `latest` for a clean `vX.Y.Z` version. This script itself only outputs the string name of the dist-tag to console.

## `generateApi`

Generates a helper file which contains metadata used to access the OCC API. This command depends on 3 inputs:

- OccUrl
  - This is the URL of the OCC platform that will be used to generate the metadata. It should look like this: https://xyz.orckestra.cloud/api/openapi?removeDuplicatedBodyElements=true
  - The OCC platform needs to use version 4.5 or above since the script uses the OpenAPI metadata.
  - For security reasons this value is stored in an environment variable
- OccToken
  - This is the X-AUTH token used to authenticate with the platform.
  - For security reasons this value is stored in an environment variable
- outputFile
  - Command line argument to the script.
  - Must be used in the following format: `--outputFile <file>`
- requestsFile
  - Command line argument to the script
  - Used to declare the list of requests to generate
  - Must be used in the following format: `--requestsFile <file>`

## `clean`

Removes the `dist/` directory from the current working directory.

## `mergeTranslations`

For each JSON file under `src/translations/`, merges in the same-named file from `node_modules/orc-shared/src/translations/`, if it exists, and writes the result back over the app's file. Keys from the `orc-shared` file take precedence over the app's own on collisions.

## `validateTranslations`

Checks that all locale files under `src/translations/` define the same set of keys, and reports (per file) any keys present in that locale but missing from the others. Exits with a non-zero code if any discrepancies are found.

Parameters:

- One or more file names (matched case-insensitively by basename) to restrict validation to those locale files. With no arguments, all files under `src/translations/` are compared against each other.

## `buildIconsSheet`

Reads all `.svg` files in `src/content/icons/` and concatenates them into a single `<symbol>`-based sprite sheet, written to `src/content/iconsSheet.svg`. Each icon's `id` is set to `icon-<filename-without-extension>`. `fill`/`stroke` attributes are normalized (stripped, or set to `stroke="none"` on paths that don't otherwise specify one) unless the icon's SVG source contains a `<!-- no post-processing -->` comment, in which case that icon is left untouched aside from the comment being stripped.

## `generateWindowsZone`

Downloads a CLDR `windowsZones.xml` file and writes out a JSON lookup table mapping IANA timezone names to Windows timezone names and vice versa.

Parameters:

- `--outputFile <file>`: Required. Path to write the resulting JSON to.
- `--windowsZonesUrl <url>`: Optional. Overrides the default CLDR `windowsZones.xml` URL to download from.
