/* eslint-disable max-lines */
import { ORIGINAL_ERRORS } from './original.js'
import { test } from './test.js'

const { Error: OriginalError } = ORIGINAL_ERRORS

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
// We purposely get arguments `(message, ...args)` to ensure
// `PonyfillAnyError.length` is `1` like `OriginalAnyError.length`
// We do not use `Function.bind()` but lexical scope instead because binding
// changes how `new ...` works.
// Node 16.9.0 - 16.10.0 had a v8 bug where `Error.prototype.cause` was defined
//  - This means an `undefined` `cause` was present on `new Error()`
//  - We do not fix this since it was only present in those 2 versions and was
//   fixed quickly
// Issues with error-cause:
//  - Package size is too big
//  - Does not support child error types
//  - TODO: find from the automated tests which ones `error-cause` does not
//    handle correctly
// TODO: check how Babel transforms the code
export const getPonyfillAnyError = function (
  OriginalAnyError,
  shouldProxy,
  argsLength,
) {
  if (test()) {
    return OriginalAnyError
  }

  const PonyfillAnyError = function (...args) {
    const error = new OriginalAnyError(...args)
    const newTarget = new.target
    fixConstructor(error, PonyfillAnyError, newTarget)
    fixStack(error)
    fixInstancePrototype(error, newTarget)
    fixCause(error, args[argsLength])
    return error
  }

  fixType({ PonyfillAnyError, OriginalAnyError, shouldProxy, argsLength })
  return PonyfillAnyError
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
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(error, 'constructor', {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  })
}

// Removes the `PonyfillAnyError` wrapper function from the stack trace.
// `captureStackTrace()` is V8-specific.
// Uses `error.constructor` instead of `PonyfillAnyError` in case a subclass was
// used.
//  - In that case, `new.target` will be used
//  - `new.target` is the function after un-binding, which is what
//    `captureStackTrace()` needs
const fixStack = function (error) {
  if (OriginalError.captureStackTrace !== undefined) {
    OriginalError.captureStackTrace(error, error.constructor)
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
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(error, 'cause', {
      value: options.cause,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  }
}

const isMissingCause = function (error, options) {
  return (
    typeof options === 'object' &&
    options !== null &&
    'cause' in options &&
    options.cause !== error.cause
  )
}

const fixType = function ({
  PonyfillAnyError,
  OriginalAnyError,
  shouldProxy,
  argsLength,
}) {
  fixConstructorName(PonyfillAnyError, OriginalAnyError)
  fixConstructorLength(PonyfillAnyError, OriginalAnyError, argsLength)
  fixStaticPrototype(PonyfillAnyError, OriginalAnyError)
  fixStaticProperties(PonyfillAnyError, OriginalAnyError)
  proxyStaticProperties(PonyfillAnyError, OriginalAnyError, shouldProxy)
}

// Constructor function's name, not the `error.name`.
// This ensures it is correct even if this file is transpiled.
const fixConstructorName = function (PonyfillAnyError, OriginalAnyError) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(PonyfillAnyError, 'name', {
    value: OriginalAnyError.name,
    writable: false,
    enumerable: false,
    configurable: true,
  })
}

// Constructor `Function.length` should be `2` for `AggregateError`, `1` for
// others
const fixConstructorLength = function (
  PonyfillAnyError,
  OriginalAnyError,
  argsLength,
) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(PonyfillAnyError, 'length', {
    value: argsLength,
    writable: false,
    enumerable: false,
    configurable: true,
  })
}

// Instead of setting
// `PonyfillAnyError.prototype.__proto__ = OriginalAnyError.prototype`, we make
// a reference to it instead.
// This ensures that PonyfillAnyErrors are not only instances of
// OriginalAnyError, but the other way around too.
// This also ensures `PonyfillAnyError.prototype.*` is same as
// `OriginalAnyError.prototype.*`, e.g. `PonyfillAnyError.prototype.toString()`
const fixStaticPrototype = function (PonyfillAnyError, OriginalAnyError) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(PonyfillAnyError, 'prototype', {
    value: OriginalAnyError.prototype,
    writable: false,
    enumerable: false,
    configurable: false,
  })
}

// Inherit `OriginalAnyError.*` static properties
const fixStaticProperties = function (PonyfillAnyError, OriginalAnyError) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.setPrototypeOf(PonyfillAnyError, OriginalAnyError)
}

// When getting|setting `PonyfillAnyError.*` static properties, get|set
// `OriginalAnyError.*` instead.
// This ensures that any code that relies on `OriginalAnyError.*` also gets any
// new values.
// For example, Node.js does so, so this is required for
// `Error.stackTrackLimit|captureStackTrace|prepareStackTrace()`
// Since we cannot use a `Proxy`, we have to use a list of known static
// properties.
// Some static properties are engine specific.
// Those properties are only defined on `Error.*`, not `TypeError.*`, etc.
//  - Setting them have no effect on `TypeError.*`, etc.
//  - `captureStackTrace()` does work but it's because it is inherited, and it
//    uses `Error` name, not `TypeError`, etc.
const proxyStaticProperties = function (
  PonyfillAnyError,
  OriginalAnyError,
  shouldProxy,
) {
  if (!shouldProxy) {
    return
  }

  STATIC_PROPERTIES.forEach((staticProperty) => {
    proxyStaticProperty(staticProperty, PonyfillAnyError, OriginalAnyError)
  })
}

const STATIC_PROPERTIES = [
  {
    propName: 'stackTraceLimit',
    testPropName: 'stackTraceLimit',
    enumerable: true,
  },
  {
    propName: 'captureStackTrace',
    testPropName: 'captureStackTrace',
    enumerable: false,
  },
  {
    propName: 'prepareStackTrace',
    testPropName: 'captureStackTrace',
    enumerable: false,
  },
]

const proxyStaticProperty = function (
  { propName, testPropName, enumerable },
  PonyfillAnyError,
  OriginalAnyError,
) {
  if (!(testPropName in OriginalAnyError)) {
    return
  }

  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(PonyfillAnyError, propName, {
    get() {
      return OriginalAnyError[propName]
    },
    set(value) {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      OriginalAnyError[propName] = value
    },
    enumerable,
    configurable: true,
  })
}
