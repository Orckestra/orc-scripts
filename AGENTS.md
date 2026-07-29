# AGENTS.md

This file provides guidance to AI coding agents working with code in this repository.

## What this is

`orc-scripts` is Orckestra's shared build/test/lint tooling package (modeled on `kcd-scripts`). It is not an application — it is an npm package that other Orckestra frontend projects (e.g. `orc-shared`) install as a dependency to get a standardized `webpack`/`babel`/`jest`/`eslint`/`prettier` setup and a `orc-scripts <script>` CLI. Changes here affect every downstream project that depends on this package, so consider backward compatibility.

## Commands

- `npm run lint` — runs `eslint src`
- `npm test` — runs this package's own Jest suite once (`node src test`)
- `npm run coverage` — runs tests with coverage (`node src test --coverage`)
- Run a single test file: `node src test path/to/file.test.js --no-watch` (or use normal Jest CLI args after the script name; `--no-watch` runs once instead of watch mode)
- `npm run test:orc-shared` — clones `orc-shared` and runs its test suite against this package as an installed dependency, to catch downstream breakage before publishing
- `npm run watch` — `node src prep && node src build --watch`, useful when developing this package while linked into a consuming project
- `npm run tag` — creates a version tag/commit via `node src tag` (see Versioning below)

Note the project's own test/lint scripts invoke the CLI directly via `node src <script>` rather than through an installed `orc-scripts` binary (since this package _is_ orc-scripts).

## Architecture

### CLI dispatch (`src/index.js` → `src/run-script.js`)

`orc-scripts <script> [args]` is the entry point. `run-script.js` resolves `<script>` to a file/directory under `src/scripts/` and spawns it as a **separate node process** (via `cross-spawn`), passing through `process.argv` and env vars, plus a synthetic `SCRIPTS_<SCRIPT>=true` env var. Running `orc-scripts` with no script name lists the available scripts (derived from `src/scripts/*`). Each script in `src/scripts/` is a standalone, runnable Node program, not just an exported function — that's why they access `process.argv` and call `process.exit` directly.

Global flag `global.amOrcScripts` (set in `src/index.js`) detects whether the CLI is running from within this package's own repo (dev) vs. installed as a dependency elsewhere, and switches the node executor used to run scripts accordingly.

### Scripts (`src/scripts/`)

Each file/directory here implements one CLI subcommand; see `docs/scripts.md` for full behavior and flags. Notable ones:

- `prep` — sets up `dist/`, copies `src/content`, `src/__mocks__`, and (non-production) `src/static` into it. Supports a project-local `src/project-prep.json` manifest of extra files/dirs to copy.
- `build/` — dispatches on the `BUILD_WEBPACK` env var: `build/web.js` (webpack, for apps) or `build/cli.js` (Babel, for libraries). Must run after `prep`.
- `start.js` — always starts a webpack-dev-server against `src/config/webpack.config.js` (it does not check `BUILD_WEBPACK`; it assumes a web app). Supports `--port`/`PORT`, and HTTPS via `HOST`/`--https`/`HTTPS`, optionally reading the cert passphrase from a `parameters.dev.xml` file found by walking up from `SSL_CERT_PATH`.
- `test.js` — thin wrapper around Jest: picks watch vs. CI mode, injects the shared Jest config from `src/config/jest.config.js` unless the consuming project defines its own.
- `tag.js` / `getDist.js` — this repo's own versioning/publishing scheme (see Versioning below); also usable by consuming projects.
- `buildDep.js` — clones a target git repo (e.g. `orc-shared`), installs this package as a dependency into it via `npm pack`+`npm install`, and runs that repo's tests — used to validate downstream compatibility.
- `extract-messages.js` — extracts `react-intl` message keys from `src/**/*.js` (excluding `*.test.js`) into `src/translations/*.json`, one file per locale declared in the consuming project's `package.json` `locales` field.
- `mergeTranslations.js` — for each `src/translations/*.json` file, merges in the same-named file from `node_modules/orc-shared/src/translations/`, with the `orc-shared` values taking precedence over the app's own on key collisions.
- `validateTranslations.js` — checks that all locale files under `src/translations/` define the same set of keys, reporting any per-locale extras; can be scoped to specific files via CLI args.
- `generateApi.js` — generates an API helper file from an OCC platform's OpenAPI metadata (needs `OccUrl`/`OccToken` env vars and `--outputFile`/`--requestsFile` args).
- `buildIconsSheet.js` — reads `src/content/icons/*.svg` and concatenates them into a single `<symbol>`-based sprite sheet at `src/content/iconsSheet.svg`, normalizing `fill`/`stroke` attributes (skippable per-icon via a `<!-- no post-processing -->` comment).
- `generateWindowsZone.js` — downloads Unicode CLDR's `windowsZones.xml` (or a URL passed via `--windowsZonesUrl`) and writes an IANA↔Windows timezone name lookup table as JSON to `--outputFile`.

### Shared configs (`src/config/`)

These are the actual babel/webpack/jest/eslint/prettier configurations. The root-level `babel.js`, `webpack.js`, `jest.js` files are thin re-export shims so consuming projects can point their own tool config at `orc-scripts/babel`, `orc-scripts/webpack`, etc. — these are the only shims listed in `package.json`'s `files` field and thus the only ones published. The root-level `eslint.config.mjs`/`prettier.config.mjs` also exist for this repo's own linting/formatting, but are intentionally left out of `files` since consuming projects don't use them. When changing tool behavior, edit the file under `src/config/`, not the root shim.

- `babel-preset.js` / `babelrc.js` — Babel setup. Behavior branches on `NODE_ENV`/`BABEL_ENV` (`test`) and env vars `BUILD_WEBPACK`/`BUILD_REACT` (enables JSX, styled-components, react-hot-loader, react-intl-auto plugins for React app builds vs. plain library builds). Also configures `babel-plugin-root-import` so consuming app code can use `~/` to mean their own `src/`.
- `webpack.config.js` — used by `build/web.js` (when `BUILD_WEBPACK=true`) and unconditionally by `start.js`. Injects global constants via `DefinePlugin`: `BUILD_ID`, `BUILD_NUMBER`, `SUPPORTED_LOCALES`, `OVERTURE_APPLICATION`, `DEPENDENCIES` — these come from the _consuming_ project's `package.json` (`locales`, `overtureApplication`, `dependencies`) and must stay in sync with the same globals declared in `src/config/jest.config.js` and allowed in `src/config/eslint.config.mjs`.
- `babel-whitelist.json` — list of `node_modules` packages that must still be run through Babel (normally node_modules is excluded) because they ship non-transpiled modern syntax; also referenced by `jest.config.js`'s `transformIgnorePatterns`.
- `jest.config.js` — shared Jest config: jsdom environment, custom resolver, coverage settings that differ for CI vs. local, and `setupFilesAfterEnv` wiring in the custom `unexpected` assertions (see below).
- `unexpected*.js` — registers custom `unexpected` assertion plugins/types (documented in `docs/assertions.md`): reducer-shape testing, React/DOM style assertions, `orc-shared` list/form/module structure validators, react-intl label validation.

### `src/utils.js`

Shared helpers used across scripts/configs: `fromRoot`/`hasFile` (resolve paths relative to the _consuming_ project's package root via `read-pkg-up`, not this package's root), `hasDep`/`hasDevDep`/`hasPeerDep`/`ifAnyDep` (introspect the consuming project's `package.json`), `parseEnv` (typed env var reads), `resolveBin`.

### Versioning/tagging scheme (`tag.js`, `getDist.js`)

`tag.js`'s actual current logic is narrower than `docs/scripts.md` describes: it only runs on a `version/*` or `develop` branch (aborts otherwise), requires a clean working directory, and always bumps to a `-dev.N` prerelease via `npm version`. `getDist.js`, however, still recognizes and maps a broader set of version shapes to npm dist-tags: a `-pre` prerelease → `beta`, a `-dev` prerelease → `dev`, a version ending in `+legacy` → `previous`, and a clean `vX.Y.Z` → `latest`. So `-pre`/`+legacy` tags are apparently expected to exist (e.g. from a manual/older process for `release/*`/`legacy/*` branches) even though `tag.js` itself no longer produces them — `master` in particular is tagged manually and should only ever carry clean `vX.Y.Z` tags. If you touch this area, reconcile `docs/scripts.md` with what the code actually does rather than trusting the doc as-is.

## CI

Azure Pipelines (`.az.yml`) runs on `master`/`develop`/`feature*`/`hotfix*`/`bug*`/`release*`: install → lint (`--max-warnings 0`) → coverage → coveralls → then, only on an exact tag match, publishes to npm with the dist-tag from `getDist`.
