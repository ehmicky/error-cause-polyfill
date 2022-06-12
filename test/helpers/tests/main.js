/* eslint-disable max-lines */
import { ERROR_TYPES } from '../types.js'

import { defineChildInstanceTests } from './child.js'
import { defineInstanceTests } from './instance/main.js'
import { defineTypeTests } from './type/main.js'

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

  defineTypeTests({ title: name, PonyfillAnyError, OriginalAnyError, args })
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
