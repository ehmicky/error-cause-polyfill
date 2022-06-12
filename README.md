[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/error-cause-polyfill.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/error-cause-polyfill)
[![Build](https://github.com/ehmicky/error-cause-polyfill/workflows/Build/badge.svg)](https://github.com/ehmicky/error-cause-polyfill/actions)
[![Node](https://img.shields.io/node/v/error-cause-polyfill.svg?logo=node.js)](https://www.npmjs.com/package/error-cause-polyfill)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

Polyfill `error.cause`.

[`error.cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)
is a recent JavaScript feature to wrap errors.

```js
try {
  doSomething()
} catch (cause) {
  throw new Error('message', { cause })
}
```

Unfortunately, it is
[not supported](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause#browser_compatibility)
in Node <16.9.0, Opera nor Safari <15. This library adds support for it in those
environments.

# Install

```bash
npm install error-cause-polyfill
```

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## polyfill()

_Return value_: `() => void`

Modifies the global error types (`Error`, `TypeError`, etc.) so they support
`error.cause`. If `error.cause` is already supported, this is a noop.

<!-- eslint-disable import/no-unassigned-import -->

```js
import 'error-cause-polyfill/auto'

try {
  doSomething()
} catch (cause) {
  throw new Error('message', { cause })
}
```

Or alternatively:

```js
import { polyfill } from 'error-cause-polyfill'

polyfill()

try {
  doSomething()
} catch (cause) {
  throw new Error('message', { cause })
}
```

This returns a function to undo everything.

```js
import { polyfill } from 'error-cause-polyfill'

const undoPolyfill = polyfill()
undoPolyfill()
```

## getErrors()

_Return value_: `object`

Returns an object with each error type (`Error`, `TypeError`, etc.) but with
`error.cause` support. If `error.cause` is already supported, this returns the
global error types as is.

Unlike [`polyfill()`](#polyfill), this does not modify the global error types.

<!-- eslint-disable no-shadow -->

```js
import { getErrors } from 'error-cause-polyfill'

const Errors = getErrors()

try {
  doSomething()
} catch (cause) {
  throw new Errors.Error('message', { cause })
}
```

## hasSupport()

_Return value_: `boolean`

Returns whether the global error types currently support `error.cause`.

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/error-cause-polyfill/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/error-cause-polyfill/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
