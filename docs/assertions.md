# Available types and assertions for `unexpected`

This script toolbox contain a set of plugins and some custom types and assertions for `unexpected`, in order to make test writing easier and more intuitive.

Documentation for the built-in assertions can be found on [the `unexpected` documentation site](http://unexpected.js.org/).

## Plugins

The provided plugins are:

- [`unexpected-sinon`](http://unexpected.js.org/unexpected-sinon/), for a better experience handling Sinon spies, mocks, etc.
- [`unexpected-immutable`](https://github.com/erikmueller/unexpected-immutable#readme), which provides handling of Immutable.js data structures.
- [`unexpected-react`](http://bruderstein.github.io/unexpected-react/), to handle React component testing in an organic way.

These plugins provide a wide array of tools to make for a pleasant testing experience, and demonstrations of common techniques can be found in the [`orc-shared` test files](https://github.com/Orckestra/orc-shared/tree/master/src) (look for files like `*.test.js`).

## Custom assertions

`orc-scripts` defines a type to help test `styled-components` rendering, and a number of custom assertions. The below documentation expects an at least cursory familiarity with `unexpected` itself and the above mentioned plugins.

### The `RenderedSCElement` type

A derivation of the `RenderedReactElement` type from `unexpected-react` to enable testing of stylesheet output. This represents a fully DOM-rendered element, not a shallow render. It is used to detect if an element can be asserted on for style testing.

### `<RenderedReactElement> finding first styled component <assertion?>`

This assertion traverses down a DOM-rendered React element tree, and passes the first styled component it finds to subsequent assertions. This is vulnerable to misunderstanding if multiple such elements are rendered, so generally, this (and `"to render style rules"` below) should only be used to check renders which are unambiguous in this respect.

### `<string> as a selector to have style rules <assertion?>`

Will go through the stylesheets of the DOM environment of the test, looking for styles fitting the selector string givenm, which are passed on to the later assertions.

### `<RenderedSCElement> when extracting style rules <assertion?>`

Gets the class name generated for the `styled-component` element, and searches for styles in the DOM head containing this selector. The resulting style strings are then passed on to further assertions.

### `<ReactElement> to render style rules <assertion?>`

Expecting the React element passed to be or contain a styled component, this assertion will identify and search out related styles in stylesheets rendered into the DOM. These will be passed on as a string to following assertions, enabling testing of the style output.

### `<function> to be a reducer with initial state <object>`

This is a baseline test for reducer functions, ensuring that they behave as expected in standard cases. Specifically, it tests two things: That the reducer does not modify a state object passed to it along with an action of an unrelated type, and that in the case of initialization, it will return an initial state fitting the passed object pattern, turned into an Immutable data structure.

### `<ReactShallowRenderer> has elements <assertion?>`

This is a utility assertion which simply extracts a shallow renderer's content, allowing it to be handled as a normal `<ReactElement>` type by following assertions.

### `<ReactElement> renders elements <assertion?>`

A chain of the `"when rendered"` assertion from `unexpected-react` and `"has elements"` above, allowing a further 'layer' of rendering to take place. It is typically combined with `"to render as"` as a prefix in order to render e.g. HOC-wrapped components.
