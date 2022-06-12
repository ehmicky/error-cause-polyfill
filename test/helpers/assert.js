/* eslint-disable max-depth, complexity, max-lines */
// eslint-disable-next-line no-restricted-imports, n/no-restricted-import
import assert from 'assert'
import { types } from 'util'

import {
  OriginalError,
  OriginalReferenceError,
  OriginalTypeError,
  OriginalSyntaxError,
  OriginalRangeError,
  OriginalURIError,
  OriginalEvalError,
  OriginalAggregateError,
  Error as PonyfillError,
  ReferenceError as PonyfillReferenceError,
  TypeError as PonyfillTypeError,
  SyntaxError as PonyfillSyntaxError,
  RangeError as PonyfillRangeError,
  URIError as PonyfillURIError,
  EvalError as PonyfillEvalError,
  AggregateError as PonyfillAggregateError,
  test,
  polyfill,
  unpolyfill,
} from 'error-cause-polyfill'

const checkDescriptor = function (object, propName, descriptor) {
  const descriptorA = Object.getOwnPropertyDescriptor(object, propName)
  return (
    descriptorA !== undefined &&
    descriptorA.writable === descriptor.writable &&
    descriptorA.enumerable === descriptor.enumerable &&
    descriptorA.configurable === descriptor.configurable &&
    (!('value' in descriptor) || descriptorA.value === descriptor.value)
  )
}

const mainErrorArgs = ['test']
const aggregateErrorArgs = [[], 'test']

const ALL_ERRORS = [
  [OriginalError, PonyfillError, mainErrorArgs],
  [OriginalReferenceError, PonyfillReferenceError, mainErrorArgs],
  [OriginalTypeError, PonyfillTypeError, mainErrorArgs],
  [OriginalSyntaxError, PonyfillSyntaxError, mainErrorArgs],
  [OriginalRangeError, PonyfillRangeError, mainErrorArgs],
  [OriginalURIError, PonyfillURIError, mainErrorArgs],
  [OriginalEvalError, PonyfillEvalError, mainErrorArgs],
  ...(AggregateError === undefined
    ? []
    : [[OriginalAggregateError, PonyfillAggregateError, aggregateErrorArgs]]),
]

// eslint-disable-next-line fp/no-loops
for (const [OriginalAnyError, PonyfillAnyError, errorArgs] of ALL_ERRORS) {
  // eslint-disable-next-line fp/no-class
  class TestError extends PonyfillAnyError {
    // eslint-disable-next-line no-useless-constructor, unicorn/custom-error-definition
    constructor(...args) {
      super(...args)
    }
  }
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(TestError.prototype, 'name', {
    value: TestError.name,
    writable: true,
    enumerable: false,
    configurable: true,
  })

  // eslint-disable-next-line fp/no-class, unicorn/custom-error-definition
  class ChildError extends TestError {}
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(ChildError.prototype, 'name', {
    value: ChildError.name,
    writable: true,
    enumerable: false,
    configurable: true,
  })

  const originalAnyError = new OriginalAnyError(...errorArgs)
  assert(originalAnyError instanceof OriginalError)
  assert(originalAnyError instanceof PonyfillError)
  assert(originalAnyError instanceof OriginalAnyError)
  assert(originalAnyError instanceof PonyfillAnyError)
  assert(Object.getPrototypeOf(originalAnyError) === OriginalAnyError.prototype)
  assert(originalAnyError.constructor === OriginalAnyError)
  assert(
    checkDescriptor(originalAnyError, 'constructor', {
      value: OriginalAnyError,
      writable: true,
      enumerable: false,
      configurable: true,
    }) ||
      checkDescriptor(Object.getPrototypeOf(originalAnyError), 'constructor', {
        value: OriginalAnyError,
        writable: true,
        enumerable: false,
        configurable: true,
      }),
  )
  assert.equal(OriginalAnyError.prototype.toString(), OriginalAnyError.name)
  assert.equal(originalAnyError.toString(), `${OriginalAnyError.name}: test`)

  assert(
    checkDescriptor(PonyfillAnyError, 'name', {
      value: OriginalAnyError.name,
      writable: false,
      enumerable: false,
      configurable: true,
    }),
  )
  assert(
    checkDescriptor(PonyfillAnyError, 'length', {
      value: errorArgs.length,
      writable: false,
      enumerable: false,
      configurable: true,
    }),
  )
  assert(
    checkDescriptor(PonyfillAnyError, 'prototype', {
      value: OriginalAnyError.prototype,
      writable: false,
      enumerable: false,
      configurable: false,
    }),
  )
  assert.equal(PonyfillAnyError.prototype.toString(), OriginalAnyError.name)

  assert(PonyfillAnyError.captureStackTrace !== undefined)

  if (PonyfillAnyError.captureStackTrace !== undefined) {
    const obj = {}
    PonyfillAnyError.captureStackTrace(obj)
    assert(obj.stack.includes('at'))
  }

  if (OriginalAnyError.name === 'Error') {
    assert(PonyfillAnyError.stackTraceLimit !== undefined)

    if (PonyfillAnyError.stackTraceLimit !== undefined) {
      const oldStackTraceLimit = PonyfillAnyError.stackTraceLimit
      // eslint-disable-next-line fp/no-mutation
      PonyfillAnyError.stackTraceLimit = 0
      assert.equal(
        new PonyfillAnyError('').stack,
        PonyfillAnyError.prototype.name,
      )
      // eslint-disable-next-line fp/no-mutation
      PonyfillAnyError.stackTraceLimit = oldStackTraceLimit
    }

    // eslint-disable-next-line fp/no-mutation
    PonyfillAnyError.prepareStackTrace = () => 'stack'
    assert.equal(new PonyfillAnyError('').stack, 'stack')
    // eslint-disable-next-line fp/no-mutation
    PonyfillAnyError.prepareStackTrace = undefined
  }

  const ponyfillAnyErrorOne = new PonyfillAnyError(...errorArgs, { cause: 1 })
  const ponyfillAnyErrorTwo = PonyfillAnyError(...errorArgs, { cause: 1 })

  // eslint-disable-next-line fp/no-loops
  for (const ponyfillAnyError of [ponyfillAnyErrorOne, ponyfillAnyErrorTwo]) {
    assert(types.isNativeError(ponyfillAnyError))
    assert(
      checkDescriptor(ponyfillAnyError, 'message', {
        value: 'test',
        writable: true,
        enumerable: false,
        configurable: true,
      }),
    )
    assert(
      checkDescriptor(Object.getPrototypeOf(ponyfillAnyError), 'name', {
        value: PonyfillAnyError.name,
        writable: true,
        enumerable: false,
        configurable: true,
      }),
    )
    assert(
      checkDescriptor(ponyfillAnyError, 'stack', {
        writable: true,
        enumerable: false,
        configurable: true,
      }),
    )
    assert(
      checkDescriptor(ponyfillAnyError, 'cause', {
        value: 1,
        writable: true,
        enumerable: false,
        configurable: true,
      }),
    )

    if (ponyfillAnyError.name === 'AggregateError') {
      assert(Array.isArray(ponyfillAnyError.errors))
      assert(
        checkDescriptor(ponyfillAnyError, 'errors', {
          writable: true,
          enumerable: false,
          configurable: true,
        }),
      )
    }

    assert.equal(ponyfillAnyError.toString(), `${ponyfillAnyError.name}: test`)
    assert.equal(
      Object.prototype.toString.call(ponyfillAnyError),
      '[object Error]',
    )
    assert(ponyfillAnyError instanceof OriginalError)
    assert(ponyfillAnyError instanceof PonyfillError)
    assert(ponyfillAnyError instanceof OriginalAnyError)
    assert(ponyfillAnyError instanceof PonyfillAnyError)
    assert(
      Object.getPrototypeOf(ponyfillAnyError) === PonyfillAnyError.prototype,
    )
  }

  const childError = new ChildError(...errorArgs, { cause: 1 })
  assert(
    checkDescriptor(childError, 'message', {
      value: 'test',
      writable: true,
      enumerable: false,
      configurable: true,
    }),
  )
  assert(
    checkDescriptor(Object.getPrototypeOf(childError), 'name', {
      value: ChildError.name,
      writable: true,
      enumerable: false,
      configurable: true,
    }),
  )
  assert(
    checkDescriptor(childError, 'stack', {
      writable: true,
      enumerable: false,
      configurable: true,
    }),
  )
  assert(
    checkDescriptor(childError, 'cause', {
      value: 1,
      writable: true,
      enumerable: false,
      configurable: true,
    }),
  )

  if (childError.name === 'AggregateError') {
    assert(Array.isArray(childError.errors))
    assert(
      checkDescriptor(childError, 'errors', {
        writable: true,
        enumerable: false,
        configurable: true,
      }),
    )
  }

  assert.equal(childError.toString(), `${childError.name}: test`)
  assert.equal(Object.prototype.toString.call(childError), '[object Error]')
  assert(childError instanceof OriginalError)
  assert(childError instanceof PonyfillError)
  assert(childError instanceof OriginalAnyError)
  assert(childError instanceof PonyfillAnyError)
  assert(childError instanceof TestError)
  assert(childError instanceof ChildError)
  assert(Object.getPrototypeOf(childError) === ChildError.prototype)
  assert(childError.constructor === ChildError)
  assert(
    checkDescriptor(childError, 'constructor', {
      value: ChildError,
      writable: true,
      enumerable: false,
      configurable: true,
    }) ||
      checkDescriptor(Object.getPrototypeOf(childError), 'constructor', {
        value: ChildError,
        writable: true,
        enumerable: false,
        configurable: true,
      }),
  )

  if (originalAnyError.name === 'Error') {
    // eslint-disable-next-line no-console, no-restricted-globals
    console.log(originalAnyError)
    // eslint-disable-next-line no-console, no-restricted-globals
    console.log(ponyfillAnyErrorOne)
    // eslint-disable-next-line no-console, no-restricted-globals
    console.log(childError)
  }
}

const hasPolyfill = function () {
  return globalThis.Error !== OriginalError
}

const testWithoutPolyfill = test()
assert(!hasPolyfill())
polyfill()
assert(hasPolyfill() !== testWithoutPolyfill)
assert(test())
unpolyfill()
assert(!hasPolyfill())
/* eslint-enable max-depth, complexity, max-lines */
