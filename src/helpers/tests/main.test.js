import { getOriginalErrors, ERROR_CLASSES } from '../classes.test.js'

import { defineClassTests } from './class/main.test.js'
import { defineInstancesTests } from './instance/main.test.js'

import { hasSupport } from 'error-cause-polyfill'

// Must be called at load time, before `polyfill()`
const OriginalErrors = getOriginalErrors()
const hasCauseSupport = hasSupport()

// Run each test on each class of error
export const defineAllTests = function (PonyfillAnyErrors, patchesCause) {
  const OriginalBaseError = OriginalErrors.Error
  const PonyfillBaseError = PonyfillAnyErrors.Error
  const supportsCause = hasCauseSupport || patchesCause

  // eslint-disable-next-line fp/no-loops
  for (const name of ERROR_CLASSES) {
    defineTests({
      name,
      PonyfillAnyErrors,
      PonyfillBaseError,
      OriginalBaseError,
      supportsCause,
    })
  }
}

const defineTests = function ({
  name,
  PonyfillAnyErrors,
  PonyfillBaseError,
  OriginalBaseError,
  supportsCause,
}) {
  const OriginalAnyError = OriginalErrors[name]
  const PonyfillAnyError = PonyfillAnyErrors[name]
  const { errors, message, cause, args } = getArgs(name)

  defineClassTests({ title: name, PonyfillAnyError, OriginalAnyError, args })
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
