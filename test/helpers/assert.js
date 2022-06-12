/* eslint-disable max-depth, max-lines */
import assert from 'assert/strict'
import { types } from 'util'

import { getErrors, test, polyfill } from 'error-cause-polyfill'

import { getOriginalErrors } from './types.js'

const mainErrorArgs = ['test']
const aggregateErrorArgs = [[], 'test']

const OriginalErrors = getOriginalErrors()
const PonyfillErrors = getErrors()

const ALL_ERRORS = [
  [OriginalErrors.Error, PonyfillErrors.Error, mainErrorArgs],
  [OriginalErrors.ReferenceError, PonyfillErrors.ReferenceError, mainErrorArgs],
  [OriginalErrors.TypeError, PonyfillErrors.TypeError, mainErrorArgs],
  [OriginalErrors.SyntaxError, PonyfillErrors.SyntaxError, mainErrorArgs],
  [OriginalErrors.RangeError, PonyfillErrors.RangeError, mainErrorArgs],
  [OriginalErrors.URIError, PonyfillErrors.URIError, mainErrorArgs],
  [OriginalErrors.EvalError, PonyfillErrors.EvalError, mainErrorArgs],
  ...(AggregateError === undefined
    ? []
    : [
        [
          OriginalErrors.AggregateError,
          PonyfillErrors.AggregateError,
          aggregateErrorArgs,
        ],
      ]),
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

  assert.deepEqual(
    Object.getOwnPropertyDescriptor(PonyfillAnyError, 'prototype'),
    {
      value: OriginalAnyError.prototype,
      writable: false,
      enumerable: false,
      configurable: false,
    },
  )

  assert.notEqual(PonyfillAnyError.captureStackTrace, undefined)

  if (PonyfillAnyError.captureStackTrace !== undefined) {
    const obj = {}
    PonyfillAnyError.captureStackTrace(obj)
    assert(obj.stack.includes('at'))
  }

  if (OriginalAnyError.name === 'Error') {
    assert.notEqual(PonyfillAnyError.stackTraceLimit, undefined)

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
    assert.deepEqual(
      Object.getOwnPropertyDescriptor(ponyfillAnyError, 'message'),
      {
        value: 'test',
        writable: true,
        enumerable: false,
        configurable: true,
      },
    )
    assert.deepEqual(
      Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(ponyfillAnyError),
        'name',
      ),
      {
        value: PonyfillAnyError.name,
        writable: true,
        enumerable: false,
        configurable: true,
      },
    )
    assert.deepEqual(
      Object.getOwnPropertyDescriptor(ponyfillAnyError, 'stack'),
      {
        value: ponyfillAnyError.stack,
        writable: true,
        enumerable: false,
        configurable: true,
      },
    )
    assert.deepEqual(
      Object.getOwnPropertyDescriptor(ponyfillAnyError, 'cause'),
      {
        value: 1,
        writable: true,
        enumerable: false,
        configurable: true,
      },
    )

    if (ponyfillAnyError.name === 'AggregateError') {
      assert(Array.isArray(ponyfillAnyError.errors))
      assert.deepEqual(
        Object.getOwnPropertyDescriptor(ponyfillAnyError, 'errors'),
        {
          value: ponyfillAnyError.errors,
          writable: true,
          enumerable: false,
          configurable: true,
        },
      )
    }

    assert.equal(
      Object.prototype.toString.call(ponyfillAnyError),
      '[object Error]',
    )
  }

  const childError = new ChildError(...errorArgs, { cause: 1 })
  assert.deepEqual(Object.getOwnPropertyDescriptor(childError, 'message'), {
    value: 'test',
    writable: true,
    enumerable: false,
    configurable: true,
  })
  assert.deepEqual(
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(childError), 'name'),
    {
      value: ChildError.name,
      writable: true,
      enumerable: false,
      configurable: true,
    },
  )
  assert.deepEqual(Object.getOwnPropertyDescriptor(childError, 'stack'), {
    value: childError.stack,
    writable: true,
    enumerable: false,
    configurable: true,
  })
  assert.deepEqual(Object.getOwnPropertyDescriptor(childError, 'cause'), {
    value: 1,
    writable: true,
    enumerable: false,
    configurable: true,
  })

  if (childError.name === 'AggregateError') {
    assert(Array.isArray(childError.errors))
    assert.deepEqual(Object.getOwnPropertyDescriptor(childError, 'errors'), {
      value: childError.errors,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  }

  assert.equal(Object.prototype.toString.call(childError), '[object Error]')
  assert(childError instanceof TestError)
  assert(childError instanceof ChildError)

  const originalAnyError = new OriginalAnyError(...errorArgs)

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
  return globalThis.Error !== OriginalErrors.Error
}

const testWithoutPolyfill = test()
assert(!hasPolyfill())
const undoPolyfill = polyfill()
assert.equal(!hasPolyfill(), testWithoutPolyfill)
assert(test())
undoPolyfill()
assert(!hasPolyfill())
/* eslint-enable max-depth, max-lines */
