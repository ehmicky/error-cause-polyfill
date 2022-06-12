import { setNonEnumProp, setNonEnumReadonlyProp, setFrozenProp } from './set.js'
import { proxyStaticProperties } from './static.js'
import { hasSupport } from './support.js'
import { ERROR_TYPES } from './types.js'

// Retrieve all ponyfill error types.
// If `error.cause` is already supported, this returns the global objects.
// In order to make it work with any `Error` polyfills (e.g. `AggregateError`
// or another `error.cause` polyfill):
//  - `getErrors()` is computed on-demand, not on load
//     - This allows users to have a clear order where each polyfill|ponyfill
//       is applied
//  - The current global types (potentially already patched by another library):
//     - Are considered the "original" ones
//     - Are cached in case they were to change
// The ponyfilled error types reference the original error types, so are not
// impacted by any other similar ponyfill being applied later.
// We create the error instance as `new OriginalAnyError(...)` then return it.
// We cannot use `class PonyfillAnyError extends OriginalAnyError` because it
// would:
//  - Prevent calling `OriginalAnyError(...)` without `new`
//  - Prevent modifying `PonyfillAnyError.prototype`, since `class` make it
//    non-configurable and non-writable
// We cannot call `new OriginalAnyError()` then copy its properties onto `this`:
//  - Error properties have some internal slots|properties which cannot be
//    copied, and which are used for example by Node.js
//    `util.types.isNativeError()`
// We do not use `Function.bind()` but lexical scope instead because binding
// changes how `new ...` works.
// Node 16.9.0 - 16.10.0 had a v8 bug where `Error.prototype.cause` was defined
//  - This means an `undefined` `cause` was present on `new Error()`
//  - We do not fix this since it was only present in those 2 versions and was
//    fixed quickly
// List of differences with native behavior:
//  - major:
//     - `error.stack` includes the polyfill internal code, when not in V8
//       (Node.js, Chrome)
//        - when using a subclass, it also includes the subclass constructor
//  - medium:
//     - `error.__proto__.constructor` is set as `error.constructor` instead
//     - The global `Error` is re-set, i.e. any previous reference to it will be
//       !== new value
//        - However, `instanceof` works correctly, in both directions
//     - `Error.stackTraceLimit|captureStackTrace|prepareStackTrace()` are a
//       `get|set` property that proxies to underlying `Error.*`
//     - `*Error.__proto__` is original `*Error`, not `Object` (for `Error`)
//       nor `Error` (for `*Error`)
//  - minor:
//     - `Error.toString()` does not return `function Error() { [native code] }`
// Issues with error-cause:
//  - Package size is too big
//  - Does not support child error types
export const getErrors = function () {
  return Object.fromEntries(ERROR_TYPES.map(getPonyfillAnyError))
}

const getPonyfillAnyError = function ({ name, shouldProxy, argsLength }) {
  const OriginalAnyError = globalThis[name]
  const OriginalBaseError = globalThis.Error

  if (hasSupport()) {
    return [name, OriginalAnyError]
  }

  const PonyfillAnyError = function (...args) {
    const error = new OriginalAnyError(...args)
    const newTarget = new.target
    fixConstructor(error, PonyfillAnyError, newTarget)
    fixStack(error, OriginalBaseError)
    fixInstancePrototype(error, newTarget)
    fixCause(error, args[argsLength])
    return error
  }

  fixType({ PonyfillAnyError, OriginalAnyError, shouldProxy, argsLength })
  return [name, PonyfillAnyError]
}

// `error.constructor` should be the function which created the class.
//  - This is often used by users to check for type
// Including if it is a subclass, therefore `new.target` must be used.
// `new.target` is `undefined` when using `PonyfillAnyError(...)` instead of
// `new PonyfillAnyError(...)`.
// We cannot set `PonyfillAnyError.prototype.constructor = PonyfillAnyError`
// since `PonyfillAnyError.prototype` is a reference to
// `OriginalAnyError.prototype`, so this would change
// `OriginalAnyError.prototype.constructor`.
const fixConstructor = function (
  error,
  PonyfillAnyError,
  value = PonyfillAnyError,
) {
  setNonEnumProp(error, 'constructor', value)
}

// Removes the `PonyfillAnyError` wrapper function from the stack trace.
// `captureStackTrace()` is V8-specific.
// Uses `error.constructor` instead of `PonyfillAnyError` in case a subclass was
// used.
//  - In that case, `new.target` will be used
//  - `new.target` is the function after un-binding, which is what
//    `captureStackTrace()` needs
const fixStack = function (error, OriginalBaseError) {
  if (OriginalBaseError.captureStackTrace !== undefined) {
    OriginalBaseError.captureStackTrace(error, error.constructor)
  }
}

// Since we create the error manually and return it from the constructor, its
// `__proto__` will be `Error.prototype`
// instead of `PonyfillAnyError.prototype` or `SubClassedError.prototype`.
// This fixes it by setting manually. `new.target` is used to handle subclasses.
// We purposely avoid using `this` since `PonyfillAnyError.call(this, ...)`
// should behave the same as `PonyfillAnyError(...)`
const fixInstancePrototype = function (error, newTarget) {
  if (
    newTarget !== undefined &&
    Object.getPrototypeOf(error) !== newTarget.prototype
  ) {
    // eslint-disable-next-line fp/no-mutating-methods
    Object.setPrototypeOf(error, newTarget.prototype)
  }
}

// Implements `error.cause` if `OriginalAnyError` does not.
const fixCause = function (error, options) {
  if (isMissingCause(error, options)) {
    setNonEnumProp(error, 'cause', options.cause)
  }
}

const isMissingCause = function (error, options) {
  return (
    isOptionsObject(options) &&
    'cause' in options &&
    options.cause !== error.cause
  )
}

const isOptionsObject = function (options) {
  return (
    (typeof options === 'object' || typeof options === 'function') &&
    options !== null
  )
}

// Fixes:
//  - Constructor `Function.name`
//     - This differs from `error.name`, although its value is the same
//     - This ensures it is correct even if this file is transpiled
//  - Constructor `Function.length`
//     - It should be `2` for `AggregateError`, `1` for others
//  - `PonyfillAnyError.prototype`
//     - Instead of setting
//       `PonyfillAnyError.prototype.__proto__ = OriginalAnyError.prototype`,
//       we make a reference to it instead.
//     - This ensures that PonyfillAnyErrors are not only instances of
//       OriginalAnyError, but the other way around too.
//     - This also ensures `PonyfillAnyError.prototype.*` is same as
//       `OriginalAnyError.prototype.*`,
//       e.g. `PonyfillAnyError.prototype.toString()`
//  - `PonyfillAnyError.*` static properties
//     - By inheriting them: `PonyfillAnyError.__proto__ === OriginalAnyError`
const fixType = function ({
  PonyfillAnyError,
  OriginalAnyError,
  shouldProxy,
  argsLength,
}) {
  setNonEnumReadonlyProp(PonyfillAnyError, 'name', OriginalAnyError.name)
  setNonEnumReadonlyProp(PonyfillAnyError, 'length', argsLength)
  setFrozenProp(PonyfillAnyError, 'prototype', OriginalAnyError.prototype)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(PonyfillAnyError, OriginalAnyError)
  proxyStaticProperties(PonyfillAnyError, OriginalAnyError, shouldProxy)
}
