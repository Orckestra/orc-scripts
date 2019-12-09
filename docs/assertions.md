# Available types and assertions for `unexpected`

This script toolbox contain a set of plugins and some custom types and assertions for `unexpected`, in order to make test writing easier and more intuitive.

Documentation for the built-in assertions can be found on [the `unexpected` documentation site](http://unexpected.js.org/).

## Plugins

The provided plugins are:

- [`unexpected-sinon`](http://unexpected.js.org/unexpected-sinon/), for a better experience handling Sinon spies, mocks, etc.
- [`unexpected-immutable`](https://github.com/erikmueller/unexpected-immutable#readme), which provides handling of Immutable.js data structures.
- [`unexpected-reaction`](http://unexpected.js.org/unexpected-reaction), to allow test React components by their rendered DOM elements.
- [`unexpected-dom`](https://unexpected.js.org/unexpected-dom) provides a suite of assertions highly useful for testing the DOM output of components.

These plugins provide a wide array of tools to make for a pleasant testing experience, and demonstrations of common techniques can be found in the [`orc-shared` test files](https://github.com/Orckestra/orc-shared/tree/master/src) (look for files like `*.test.js`).

## Custom assertions

`orc-scripts` defines a type to help test `styled-components` rendering, and a number of custom assertions. The below documentation expects an at least cursory familiarity with `unexpected` itself and the above mentioned plugins.

### `<string> as a selector to have style rules <assertion?>`

Will go through the stylesheets of the DOM environment of the test, looking for styles fitting the selector string givenm, which are passed on to the later assertions.

### `<DOMElement> to render style rules satisfying <assertion?>`

This assertion will identify and search out styles matching any class name in the subject DOM element, in stylesheets rendered into the DOM. These will be passed on as a string to following assertions, enabling testing of the style output.

### `<function> to be a reducer with initial state <object>`

This is a baseline test for reducer functions, ensuring that they behave as expected in standard cases. Specifically, it tests two things: That the reducer does not modify a state object passed to it along with an action of an unrelated type, and that in the case of initialization, it will return an initial state fitting the passed object pattern, turned into an Immutable data structure.

### `<ReactShallowRenderer> has elements <assertion?>`

This is a utility assertion which simply extracts a shallow renderer's content, allowing it to be handled as a normal `<ReactElement>` type by following assertions.

### `<ReactElement> renders elements <assertion?>`

A chain of the `"when rendered"` assertion from `unexpected-react` and `"has elements"` above, allowing a further 'layer' of rendering to take place. It is typically combined with `"to render as"` as a prefix in order to render e.g. HOC-wrapped components.

### `<any> to be a label`

Checks that the subject is either a string, or an object with `defaultMessage` and `id` keys with string values, making it a legal `react-intl` message descriptor.

### `<object> to be a module structure`

Verifies that the subject fits the expected rules for a module object, gives useful error messages if it does not.

### `<object> to be a column definition`

Checks that the subject is a valid column defintion as used by [List components](https://github.com/Orckestra/orc-shared/blob/master/docs/lists.md#column-configuration).

### `<array-like> to be a form definition`

Checks that the array is a valid definition for a [Form component](https://github.com/Orckestra/orc-shared/blob/master/docs/forms.md), q.v.
