import { getOriginalErrors, ERROR_TYPES } from '../types.js'

import { defineInstancesTests } from './instance/main.js'
import { defineTypeTests } from './type/main.js'

// Must be called at load time, before `polyfill()`
const OriginalErrors = getOriginalErrors()

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
  const { PonyfillAnyError } = getTypes(name)
  const OriginalAnyError = OriginalErrors[name]
  const { errors, message, cause, args } = getArgs(name)

  defineTypeTests({ title: name, PonyfillAnyError, OriginalAnyError, args })
  defineInstancesTests({
    name,
    PonyfillAnyError,
    PonyfillBaseError,
    OriginalAnyError,
    OriginalBaseError,
    supportsCause,
    errors,
    message,
    cause,
    args,
  })
}

const getArgs = function (name) {
  const errors = name === 'AggregateError' ? [['testErrors']] : []
  const message = 'testMessage'
  const cause = 'testCause'
  const args = [...errors, message, { cause }]
  return { errors, message, cause, args }
}
