/* eslint-disable max-lines */
// eslint-disable-next-line ava/no-ignored-test-files
import { types } from 'util'

import test from 'ava'

import { ERROR_TYPES } from '../types.js'

// Run each test on each type of error
export const defineAllTests = function (getTypes) {
  // eslint-disable-next-line fp/no-loops
  for (const name of ERROR_TYPES) {
    defineTests({ name, getTypes })
  }
}

const defineTests = function ({ name, getTypes }) {
  const {
    PonyfillAnyError,
    PonyfillBaseError,
    OriginalAnyError,
    OriginalBaseError,
  } = getTypes(name)

  const { errors, message, cause, args } = getArgs(name)

  defineParentTypeTests({ title: name, PonyfillAnyError, OriginalAnyError })

  const instanceKinds = getInstanceKinds(PonyfillAnyError, args)
  defineInstancesTests({
    instanceKinds,
    name,
    PonyfillBaseError,
    OriginalAnyError,
    OriginalBaseError,
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
}

// Tests run on the parent and child error instances
const defineInstancesTests = function ({
  instanceKinds,
  name,
  PonyfillBaseError,
  OriginalAnyError,
  OriginalBaseError,
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
    t.is(error.cause, cause)
  })

  test(`error.cause has right descriptors | ${title}`, (t) => {
    t.deepEqual(getPropertyDescriptor(error, 'cause'), {
      value: error.cause,
      writable: true,
      enumerable: false,
      configurable: true,
    })
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

const { hasOwnProperty: hasOwn } = Object.prototype

// Tests run on the parent and child error instances, for AggregateError
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
