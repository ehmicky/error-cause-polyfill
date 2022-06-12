// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { OriginalErrors, Errors } from 'error-cause-polyfill'

import { ERROR_TYPES } from './types.js'

export const defineAllTests = function (getTypes) {
  // eslint-disable-next-line fp/no-loops
  for (const { name, args } of ERROR_TYPES) {
    defineTests({ name, args, getTypes })
  }
}

const defineTests = function ({ name, args, getTypes }) {
  const { ErrorType, OriginalAnyError } = getTypes(name)
  const ChildError = getChildError(ErrorType)
  const GrandChildError = getChildError(ChildError)
  const ErrorTypes = { ErrorType, ChildError, GrandChildError }
  Object.entries(ErrorTypes).forEach(([ErrorTypeName, ErrorTypeA]) => {
    const title = `| ${name} | ${ErrorTypeName}`
    defineTestsSeries({ title, args, ErrorType: ErrorTypeA, OriginalAnyError })
  })
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
  args,
  ErrorType,
  OriginalAnyError,
}) {
  const message = 'test'
  const error = new ErrorType(...args, message)

  test(`Is instance of original base Error ${title}`, (t) => {
    t.true(error instanceof OriginalErrors.Error)
  })

  test(`Is instance of polyfill base Error ${title}`, (t) => {
    t.true(error instanceof Errors.Error)
  })

  test(`Is instance of original Error ${title}`, (t) => {
    t.true(error instanceof OriginalAnyError)
  })

  test(`Is instance of polyfill Error ${title}`, (t) => {
    t.true(error instanceof ErrorType)
  })
}
