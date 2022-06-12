/* eslint-disable max-lines */
// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

import { ERROR_TYPES } from './types.js'

// Run each test on each type of error
export const defineAllTests = function (getTypes) {
  // eslint-disable-next-line fp/no-loops
  for (const { name, args } of ERROR_TYPES) {
    defineTests({ name, args, getTypes })
  }
}

const defineTests = function ({ name, args, getTypes }) {
  const {
    PonyfillAnyError,
    PonyfillBaseError,
    OriginalAnyError,
    OriginalBaseError,
  } = getTypes(name)

  const message = 'test'
  const argsA = [...args, message]

  defineParentTypeTests({
    title: name,
    PonyfillAnyError,
    OriginalAnyError,
  })

  const typeKinds = getTypeKinds(PonyfillAnyError)
  defineTypesTests(typeKinds, name)

  const instanceKinds = getInstanceKinds(typeKinds, argsA)
  defineInstancesTests({
    instanceKinds,
    name,
    PonyfillBaseError,
    OriginalAnyError,
    OriginalBaseError,
  })
}

// Run each test on the ErrorType, but also a child and grand child of it.
const getTypeKinds = function (PonyfillAnyError) {
  const ChildError = getChildError(PonyfillAnyError)
  const GrandChildError = getChildError(ChildError)
  return { PonyfillAnyError, ChildError, GrandChildError }
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

// Run with and without `new` for the base type.
const getInstanceKinds = function (
  { PonyfillAnyError, ChildError, GrandChildError },
  args,
) {
  return [
    {
      title: 'NewErrorType',
      PonyfillAnyError,
      error: new PonyfillAnyError(...args),
    },
    {
      title: 'BareErrorType',
      PonyfillAnyError,
      error: PonyfillAnyError(...args),
    },
    {
      title: 'ChildError',
      PonyfillAnyError: ChildError,
      error: new ChildError(...args),
    },
    {
      title: 'GrandChildError',
      PonyfillAnyError: GrandChildError,
      error: new GrandChildError(...args),
    },
  ]
}

// Tests run only on the parent Type
const defineParentTypeTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
}) {
  test(`Is instance of original base Error | ${title}`, (t) => {
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
}

// Tests run on the parent and child Types
const defineTypesTests = function (typeKinds, name) {
  Object.entries(typeKinds).forEach(([title, PonyfillAnyError]) => {
    defineTypeTests(`${name} | ${title}`, PonyfillAnyError)
  })
}

const defineTypeTests = function (title, PonyfillAnyError) {}

// Tests run on the parent and child error instances
const defineInstancesTests = function ({
  instanceKinds,
  name,
  PonyfillBaseError,
  OriginalAnyError,
  OriginalBaseError,
}) {
  instanceKinds.forEach(({ title, PonyfillAnyError, error }) => {
    defineInstanceTests({
      title: `${name} | ${title}`,
      error,
      PonyfillAnyError,
      PonyfillBaseError,
      OriginalAnyError,
      OriginalBaseError,
    })
  })
}

const defineInstanceTests = function ({
  title,
  error,
  PonyfillAnyError,
  PonyfillBaseError,
  OriginalAnyError,
  OriginalBaseError,
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
      value: PonyfillAnyError,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })

  test(`error.toString() returns name and message | ${title}`, (t) => {
    t.is(error.toString(), `${PonyfillAnyError.name}: ${error.message}`)
  })
}

// Return property descriptor that is own or is inherited from direct parent
const getPropertyDescriptor = function (object, propName) {
  return (
    Object.getOwnPropertyDescriptor(object, propName) ||
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(object), propName)
  )
}
