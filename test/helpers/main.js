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
  const kinds = getKinds(PonyfillAnyError, argsA)
  kinds.forEach(({ title, PonyfillAnyError: PonyfillAnyErrorA, error }) => {
    const titleA = `| ${name} | ${title}`
    defineTestsSeries({
      title: titleA,
      error,
      PonyfillAnyError: PonyfillAnyErrorA,
      PonyfillBaseError,
      OriginalAnyError,
      OriginalBaseError,
    })
  })
}

// Run each test on the ErrorType, but also a child and grand child of it.
// Also run with and without `new` for the base type.
const getKinds = function (PonyfillAnyError, args) {
  const ChildError = getChildError(PonyfillAnyError)
  const GrandChildError = getChildError(ChildError)
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

const defineTestsSeries = function ({
  title,
  error,
  PonyfillAnyError,
  PonyfillBaseError,
  OriginalAnyError,
  OriginalBaseError,
}) {
  test(`Is instance of original base Error ${title}`, (t) => {
    t.true(error instanceof OriginalBaseError)
  })

  test(`Is instance of ponyfill base Error ${title}`, (t) => {
    t.true(error instanceof PonyfillBaseError)
  })

  test(`Is instance of original Error ${title}`, (t) => {
    t.true(error instanceof OriginalAnyError)
  })

  test(`Is instance of ponyfill Error ${title}`, (t) => {
    t.true(error instanceof PonyfillAnyError)
  })

  test(`__proto__ is constructor's prototype ${title}`, (t) => {
    t.is(Object.getPrototypeOf(error), PonyfillAnyError.prototype)
  })
}
