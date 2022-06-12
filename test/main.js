import assert from 'assert'
import { types } from 'util'

import test from 'ava'

const errorArgs = ['test']
const aggregateErrorArgs = [[], 'test']

const ALL_ERRORS = [
  [OriginalError, PonyfillError, errorArgs],
  [OriginalReferenceError, PonyfillReferenceError, errorArgs],
  [OriginalTypeError, PonyfillTypeError, errorArgs],
  [OriginalSyntaxError, PonyfillSyntaxError, errorArgs],
  [OriginalRangeError, PonyfillRangeError, errorArgs],
  [OriginalURIError, PonyfillURIError, errorArgs],
  [OriginalEvalError, PonyfillEvalError, errorArgs],
  ...(hasAggregateError()
    ? [[OriginalAggregateError, PonyfillAggregateError, aggregateErrorArgs]]
    : []),
]

for (const [OriginalAnyError, PonyfillAnyError, errorArgs] of ALL_ERRORS) {
  // eslint-disable-next-line fp/no-class
  class TestError extends PonyfillAnyError {
    constructor(...args) {
      super(...args)
    }
  }
  Object.defineProperty(TestError.prototype, 'name', {
    value: TestError.name,
    writable: true,
    enumerable: false,
    configurable: true,
  })

  class ChildError extends TestError {
    constructor() {
      super()
      this.name = 'ChildError'
    }
  }
  Object.defineProperty(ChildError.prototype, 'name', {
    value: ChildError.name,
    writable: true,
    enumerable: false,
    configurable: true,
  })

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

  const originalAnyError = new OriginalAnyError(...errorArgs)
  assert(originalAnyError instanceof OriginalError)
  assert(originalAnyError instanceof PonyfillError)
  assert(originalAnyError instanceof OriginalAnyError)
  assert(originalAnyError instanceof PonyfillAnyError)
  assert(originalAnyError.__proto__ === OriginalAnyError.prototype)
  assert(originalAnyError.constructor === OriginalAnyError)
  assert(
    checkDescriptor(originalAnyError, 'constructor', {
      value: OriginalAnyError,
      writable: true,
      enumerable: false,
      configurable: true,
    }) ||
      checkDescriptor(originalAnyError.__proto__, 'constructor', {
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
      PonyfillAnyError.stackTraceLimit = 0
      assert.equal(
        new PonyfillAnyError('').stack,
        PonyfillAnyError.prototype.name,
      )
      PonyfillAnyError.stackTraceLimit = oldStackTraceLimit
    }

    PonyfillAnyError.prepareStackTrace = () => 'mystack'
    assert.equal(new PonyfillAnyError('').stack, 'mystack')
    PonyfillAnyError.prepareStackTrace = undefined
  }

  const ponyfillAnyErrorOne = new PonyfillAnyError(...errorArgs, { cause: 1 })
  const ponyfillAnyErrorTwo = PonyfillAnyError(...errorArgs, { cause: 1 })

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
      checkDescriptor(ponyfillAnyError.__proto__, 'name', {
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
    assert(ponyfillAnyError.__proto__ === PonyfillAnyError.prototype)
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
    checkDescriptor(childError.__proto__, 'name', {
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
  assert(childError.__proto__ === ChildError.prototype)
  assert(childError.constructor === ChildError)
  assert(
    checkDescriptor(childError, 'constructor', {
      value: ChildError,
      writable: true,
      enumerable: false,
      configurable: true,
    }) ||
      checkDescriptor(childError.__proto__, 'constructor', {
        value: ChildError,
        writable: true,
        enumerable: false,
        configurable: true,
      }),
  )

  if (originalAnyError.name === 'Error') {
    console.log(originalAnyError)
    console.log(ponyfillAnyErrorOne)
    console.log(childError)
  }
}

const testWithoutPolyfill = test()
assert(!hasPolyfill())
polyfill()
assert(hasPolyfill() !== testWithoutPolyfill)
assert(test())
unpolyfill()
assert(!hasPolyfill())
