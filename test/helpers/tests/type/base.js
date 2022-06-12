// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

const { propertyIsEnumerable: isEnum } = Object.prototype

// Tests run only on the parent Type, if "Error"
export const defineBaseTypeTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) {
  defineBaseTypeLimitTests({ title, PonyfillAnyError, OriginalAnyError, args })
  defineBaseTypeCaptTests({ title, PonyfillAnyError, OriginalAnyError })
  defineBaseTypePrepTests({ title, PonyfillAnyError, OriginalAnyError, args })
}

// Tests run only on the parent Type, if "Error", for `stackTraceLimit`
const defineBaseTypeLimitTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) {
  if (!('stackTraceLimit' in OriginalAnyError)) {
    return
  }

  test(`Error.stackTraceLimit is same as original | ${title}`, (t) => {
    t.is(PonyfillAnyError.stackTraceLimit, OriginalAnyError.stackTraceLimit)
  })

  test.serial(`Error.stackTraceLimit works | ${title}`, (t) => {
    const oldStackTraceLimit = PonyfillAnyError.stackTraceLimit
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    PonyfillAnyError.stackTraceLimit = 0
    const error = new PonyfillAnyError(...args)
    t.is(error.stack, `${error.name}: ${error.message}`)
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    PonyfillAnyError.stackTraceLimit = oldStackTraceLimit
  })
}

// Tests run only on the parent Type, if "Error", for `captureStackTrace()`
const defineBaseTypeCaptTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
}) {
  if (!('captureStackTrace' in OriginalAnyError)) {
    return
  }

  test(`Error.captureStackTrace() is same as original | ${title}`, (t) => {
    t.is(PonyfillAnyError.captureStackTrace, OriginalAnyError.captureStackTrace)
  })

  test(`Error.captureStackTrace() is not enumerable | ${title}`, (t) => {
    t.false(isEnum.call(PonyfillAnyError, 'captureStackTrace'))
  })

  test(`Error.captureStackTrace() works | ${title}`, (t) => {
    const error = {}
    PonyfillAnyError.captureStackTrace(error)
    t.true(error.stack.includes(`${PonyfillAnyError.name}\n`))
    t.true(error.stack.includes('at '))
  })
}

// Tests run only on the parent Type, if "Error", for `prepareStackTrace()`
const defineBaseTypePrepTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) {
  if (!('prepareStackTrace' in OriginalAnyError)) {
    return
  }

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
}
