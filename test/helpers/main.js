// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { Errors } from 'error-cause-polyfill'

import { ERROR_TYPES } from './types.js'

// Run each test on each type of error
export const defineAllTests = function (getTypes) {
  // eslint-disable-next-line fp/no-loops
  for (const { name, args } of ERROR_TYPES) {
    defineTests({ name, args, getTypes })
  }
}

const defineTests = function ({ name, args, getTypes }) {
  const { ErrorType, OriginalAnyError, OriginalBaseError } = getTypes(name)
  const message = 'test'
  const argsA = [...args, message]
  const kinds = getKinds(ErrorType, argsA)
  kinds.forEach(({ title, AnyError, error }) => {
    const titleA = `| ${name} | ${title}`
    defineTestsSeries({
      title: titleA,
      error,
      AnyError,
      OriginalAnyError,
      OriginalBaseError,
    })
  })
}

// Run each test on the ErrorType, but also a child and grand child of it.
// Also run with and without `new` for the base type.
const getKinds = function (ErrorType, args) {
  const ChildError = getChildError(ErrorType)
  const GrandChildError = getChildError(ChildError)
  return [
    {
      title: 'NewErrorType',
      AnyError: ErrorType,
      error: new ErrorType(...args),
    },
    {
      title: 'BareErrorType',
      AnyError: ErrorType,
      error: ErrorType(...args),
    },
    {
      title: 'ChildError',
      AnyError: ChildError,
      error: new ChildError(...args),
    },
    {
      title: 'GrandChildError',
      AnyError: GrandChildError,
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
  AnyError,
  OriginalAnyError,
  OriginalBaseError,
}) {
  test(`Is instance of original base Error ${title}`, (t) => {
    t.true(error instanceof OriginalBaseError)
  })

  test(`Is instance of polyfill base Error ${title}`, (t) => {
    t.true(error instanceof Errors.Error)
  })

  test(`Is instance of original Error ${title}`, (t) => {
    t.true(error instanceof OriginalAnyError)
  })

  test(`Is instance of polyfill Error ${title}`, (t) => {
    t.true(error instanceof AnyError)
  })

  test(`__proto__ is constructor's prototype ${title}`, (t) => {
    t.is(Object.getPrototypeOf(error), AnyError.prototype)
  })
}
