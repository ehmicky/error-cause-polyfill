/* eslint-disable max-lines */
// eslint-disable-next-line ava/no-ignored-test-files
import { types } from 'util'

import test from 'ava'

import { ERROR_TYPES } from '../types.js'

const { hasOwnProperty: hasOwn, propertyIsEnumerable: isEnum } =
  Object.prototype

// Run each test on each type of error
export const defineAllTests = function (
  getTypes,
  { PonyfillBaseError, OriginalBaseError, supportsCause },
) {
  // eslint-disable-next-line fp/no-loops
  for (const name of ERROR_TYPES) {
    defineTests({
      name,
      getTypes,
      PonyfillBaseError,
      OriginalBaseError,
      supportsCause,
    })
  }
}

const defineTests = function ({
  name,
  getTypes,
  PonyfillBaseError,
  OriginalBaseError,
  supportsCause,
}) {
  const { PonyfillAnyError, OriginalAnyError } = getTypes(name)

  const { errors, message, cause, args } = getArgs(name)

  defineParentTypeTests({
    title: name,
    PonyfillAnyError,
    OriginalAnyError,
    args,
  })

  const instanceKinds = getInstanceKinds(PonyfillAnyError, args)
  defineInstancesTests({
    instanceKinds,
    name,
    PonyfillBaseError,
    OriginalAnyError,
    OriginalBaseError,
    supportsCause,
    errors,
    message,
    cause,
  })
  defineChildInstanceTests(name, instanceKinds)
}

const getArgs = function (name) {
  const errors = name === 'AggregateError' ? [['testErrors']] : []
  const message = 'testMessage'
  const cause = 'testCause'
  const args = [...errors, message, { cause }]
  return { errors, message, cause, args }
}

const getChildError = function (ParentError) {
  // eslint-disable-next-line fp/no-class, unicorn/custom-error-definition
  class ChildError extends ParentError {}
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(ChildError.prototype, 'name', {
    value: ChildError.name,
    writable: true,
    enumerable: false,
    configurable: true,
  })
  return ChildError
}

// Run each test on the ErrorType, but also a child and grand child of it.
// Also run with and without `new` for the base type.
const getInstanceKinds = function (PonyfillAnyError, args) {
  const ChildError = getChildError(PonyfillAnyError)
  const GrandChildError = getChildError(ChildError)
  return {
    NewErrorType: {
      PonyfillAnyError,
      error: new PonyfillAnyError(...args),
    },
    BareErrorType: {
      PonyfillAnyError,
      error: PonyfillAnyError(...args),
    },
    ChildError: {
      PonyfillAnyError: ChildError,
      error: new ChildError(...args),
    },
    GrandChildError: {
      PonyfillAnyError: GrandChildError,
      error: new GrandChildError(...args),
    },
  }
}

// Tests run only on the parent Type
const defineParentTypeTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) {
  test(`prototype is same as original prototype | ${title}`, (t) => {
    t.is(PonyfillAnyError.prototype, OriginalAnyError.prototype)
  })

  test(`prototype has right descriptors | ${title}`, (t) => {
    t.deepEqual(
      Object.getOwnPropertyDescriptor(PonyfillAnyError, 'prototype'),
      {
        value: PonyfillAnyError.prototype,
        writable: false,
        enumerable: false,
        configurable: false,
      },
    )
  })

  test(`prototype.toString() is correct | ${title}`, (t) => {
    t.is(PonyfillAnyError.prototype.toString(), PonyfillAnyError.name)
  })

  test(`Constructor name is kept | ${title}`, (t) => {
    t.is(PonyfillAnyError.name, OriginalAnyError.name)
  })

  test(`Constructor name has right descriptors | ${title}`, (t) => {
    t.deepEqual(Object.getOwnPropertyDescriptor(PonyfillAnyError, 'name'), {
      value: PonyfillAnyError.name,
      writable: false,
      enumerable: false,
      configurable: true,
    })
  })

  test(`Constructor length is kept | ${title}`, (t) => {
    t.is(PonyfillAnyError.length, OriginalAnyError.length)
  })

  test(`Constructor length has right descriptors | ${title}`, (t) => {
    t.deepEqual(Object.getOwnPropertyDescriptor(PonyfillAnyError, 'length'), {
      value: PonyfillAnyError.length,
      writable: false,
      enumerable: false,
      configurable: true,
    })
  })

  if (PonyfillAnyError.name === 'Error') {
    defineParBaseTypeTests({ title, PonyfillAnyError, OriginalAnyError, args })
  } else {
    defineParMiscTypeTests({ title, PonyfillAnyError, args })
  }
}

// Tests run only on the parent Type, if "Error"
const defineParBaseTypeTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) {
  test(`Error.captureStackTrace() is same as original | ${title}`, (t) => {
    t.is(PonyfillAnyError.captureStackTrace, OriginalAnyError.captureStackTrace)
  })

  test(`Error.captureStackTrace() is not enumerable | ${title}`, (t) => {
    t.false(isEnum.call(PonyfillAnyError, 'captureStackTrace'))
  })

  test.skip(`Error.captureStackTrace() works | ${title}`, (t) => {
    const error = {}
    PonyfillAnyError.captureStackTrace(error)
    t.true(error.stack.includes(`${PonyfillAnyError.name}\n`))
    t.true(error.stack.includes('at '))
  })

  test(`Error.prepareStackTrace() is same as original | ${title}`, (t) => {
    t.is(PonyfillAnyError.prepareStackTrace, OriginalAnyError.prepareStackTrace)
  })

  test(`Error.prepareStackTrace() is not enumerable | ${title}`, (t) => {
    t.false(isEnum.call(PonyfillAnyError, 'prepareStackTrace'))
  })

  test.serial(`Error.prepareStackTrace() works | ${title}`, (t) => {
    const stack = 'testStack'
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    PonyfillAnyError.prepareStackTrace = () => stack
    t.is(new PonyfillAnyError(...args).stack, stack)
    // eslint-disable-next-line fp/no-delete, no-param-reassign
    delete PonyfillAnyError.prepareStackTrace

    if ('prepareStackTrace' in Object.getPrototypeOf(PonyfillAnyError)) {
      // eslint-disable-next-line fp/no-delete
      delete Object.getPrototypeOf(PonyfillAnyError).prepareStackTrace
    }

    t.false('prepareStackTrace' in PonyfillAnyError)
  })

  test(`Error.stackTraceLimit is same as original | ${title}`, (t) => {
    t.is(PonyfillAnyError.stackTraceLimit, OriginalAnyError.stackTraceLimit)
  })

  test.serial.skip(`Error.stackTraceLimit works | ${title}`, (t) => {
    const oldStackTraceLimit = Object.getOwnPropertyDescriptor(
      PonyfillAnyError,
      'stackTraceLimit',
    )
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    PonyfillAnyError.stackTraceLimit = 0
    const error = new PonyfillAnyError(...args)
    t.is(error.stack, `${error.name}: ${error.message}`)
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(
      PonyfillAnyError,
      'stackTraceLimit',
      oldStackTraceLimit,
    )
  })
}

// Tests run only on the parent Type, if not "Error"
const defineParMiscTypeTests = function ({ title, PonyfillAnyError, args }) {
  test(`MiscError.captureStackTrace() is present | ${title}`, (t) => {
    t.true('captureStackTrace' in PonyfillAnyError)
  })

  test(`MiscError.captureStackTrace() is inherited | ${title}`, (t) => {
    t.false(hasOwnProperty.call(PonyfillAnyError, 'captureStackTrace'))
  })

  test(`MiscError.captureStackTrace() does not include type name | ${title}`, (t) => {
    const error = {}
    PonyfillAnyError.captureStackTrace(error)
    t.false(error.stack.includes(`${PonyfillAnyError.name}\n`))
  })

  test(`MiscError.prepareStackTrace() is not present | ${title}`, (t) => {
    t.false('prepareStackTrace' in PonyfillAnyError)
  })

  test.serial(`MiscError.prepareStackTrace() is a noop | ${title}`, (t) => {
    const stack = 'testStack'
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    PonyfillAnyError.prepareStackTrace = () => stack
    t.not(new PonyfillAnyError(...args).stack, stack)
    // eslint-disable-next-line fp/no-delete, no-param-reassign
    delete PonyfillAnyError.prepareStackTrace
  })

  test(`MiscError.stackTraceLimit is present | ${title}`, (t) => {
    t.true('stackTraceLimit' in PonyfillAnyError)
  })

  test(`MiscError.stackTraceLimit is inherited | ${title}`, (t) => {
    t.false(hasOwnProperty.call(PonyfillAnyError, 'stackTraceLimit'))
  })

  test.serial.skip(`MiscError.stackTraceLimit is a noop | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    PonyfillAnyError.stackTraceLimit = 0
    const error = new PonyfillAnyError(...args)
    t.true(error.stack.includes('at '))
    // eslint-disable-next-line fp/no-delete, no-param-reassign
    delete PonyfillAnyError.stackTraceLimit
  })
}

// Tests run on the parent and child error instances
const defineInstancesTests = function ({
  instanceKinds,
  name,
  PonyfillBaseError,
  OriginalAnyError,
  OriginalBaseError,
  supportsCause,
  errors,
  message,
  cause,
}) {
  Object.entries(instanceKinds).forEach(
    ([title, { PonyfillAnyError, error }]) => {
      defineInstanceTests({
        title: `${name} | ${title}`,
        error,
        PonyfillAnyError,
        PonyfillBaseError,
        OriginalAnyError,
        OriginalBaseError,
        supportsCause,
        errors,
        message,
        cause,
      })
    },
  )
}

// eslint-disable-next-line max-statements
const defineInstanceTests = function ({
  title,
  error,
  PonyfillAnyError,
  PonyfillBaseError,
  OriginalAnyError,
  OriginalBaseError,
  supportsCause,
  errors,
  message,
  cause,
}) {
  test(`Is instance of original base Error | ${title}`, (t) => {
    t.true(error instanceof OriginalBaseError)
  })

  test(`Is instance of ponyfill base Error | ${title}`, (t) => {
    t.true(error instanceof PonyfillBaseError)
  })

  test(`Is instance of original Error | ${title}`, (t) => {
    t.true(error instanceof OriginalAnyError)
  })

  test(`Is instance of ponyfill Error | ${title}`, (t) => {
    t.true(error instanceof PonyfillAnyError)
  })

  test(`__proto__ is constructor's prototype | ${title}`, (t) => {
    t.is(Object.getPrototypeOf(error), PonyfillAnyError.prototype)
  })

  test(`constructor is correct | ${title}`, (t) => {
    t.is(error.constructor, PonyfillAnyError)
  })

  test(`constructor has right descriptors | ${title}`, (t) => {
    t.deepEqual(getPropertyDescriptor(error, 'constructor'), {
      value: error.constructor,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })

  test(`error.name is correct | ${title}`, (t) => {
    t.is(error.name, PonyfillAnyError.name)
  })

  test(`error.name is inherited | ${title}`, (t) => {
    t.false(hasOwn.call(error, 'name'))
    t.true(hasOwn.call(Object.getPrototypeOf(error), 'name'))
  })

  test(`error.name has right descriptors | ${title}`, (t) => {
    t.deepEqual(getPropertyDescriptor(Object.getPrototypeOf(error), 'name'), {
      value: error.name,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })

  test(`error.message is correct | ${title}`, (t) => {
    t.is(error.message, message)
  })

  test(`error.message has right descriptors | ${title}`, (t) => {
    t.deepEqual(getPropertyDescriptor(error, 'message'), {
      value: error.message,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })

  test(`error.stack has right descriptors | ${title}`, (t) => {
    t.deepEqual(getPropertyDescriptor(error, 'stack'), {
      value: error.stack,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })

  test(`error.cause is patched | ${title}`, (t) => {
    t.is(error.cause === cause, supportsCause)
  })

  test(`error.cause has right descriptors | ${title}`, (t) => {
    t.deepEqual(
      getPropertyDescriptor(error, 'cause'),
      supportsCause
        ? {
            value: error.cause,
            writable: true,
            enumerable: false,
            configurable: true,
          }
        : undefined,
    )
  })

  test(`error.toString() returns name and message | ${title}`, (t) => {
    t.is(error.toString(), `${PonyfillAnyError.name}: ${error.message}`)
  })

  test(`Object.prototype.toString.call() is correct | ${title}`, (t) => {
    t.is(Object.prototype.toString.call(error), '[object Error]')
  })

  test(`Keeps error internal slots | ${title}`, (t) => {
    t.true(types.isNativeError(error))
  })

  if (PonyfillAnyError.name === 'AggregateError') {
    defineAggInstanceTests(title, error, errors)
  }
}

// Return property descriptor that is own or is inherited from direct parent
const getPropertyDescriptor = function (object, propName) {
  return (
    Object.getOwnPropertyDescriptor(object, propName) ||
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(object), propName)
  )
}

// Tests run on the parent and child error instances, if "AggregateError"
const defineAggInstanceTests = function (title, error, errors) {
  test(`error.errors is correct | ${title}`, (t) => {
    t.deepEqual(error.errors, errors[0])
  })

  test(`error.errors has right descriptors | ${title}`, (t) => {
    t.deepEqual(getPropertyDescriptor(error, 'errors'), {
      value: error.errors,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })
}

// Tests run on the child error instances
const defineChildInstanceTests = function (
  title,
  {
    ChildError: { PonyfillAnyError: ChildError },
    GrandChildError: { error: grandChildError },
  },
) {
  test(`Grand child error is instanceof child error | ${title}`, (t) => {
    t.true(grandChildError instanceof ChildError)
  })
}
