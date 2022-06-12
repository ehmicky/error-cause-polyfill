// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

// Tests run only on the parent Type, if not "Error"
export const defineMiscTypeTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) {
  defineMiscTypeLimitTests({ title, PonyfillAnyError, OriginalAnyError, args })
  defineMiscTypeCaptTests({ title, PonyfillAnyError, OriginalAnyError })
  defineMiscTypePrepTests({ title, PonyfillAnyError, OriginalAnyError, args })
}

// Tests run only on the parent Type, if not "Error", for `stackTraceLimit`
const defineMiscTypeLimitTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) {
  if (!('stackTraceLimit' in OriginalAnyError)) {
    return
  }

  test(`MiscError.stackTraceLimit is present | ${title}`, (t) => {
    t.true('stackTraceLimit' in PonyfillAnyError)
  })

  test(`MiscError.stackTraceLimit is inherited | ${title}`, (t) => {
    t.false(hasOwnProperty.call(PonyfillAnyError, 'stackTraceLimit'))
  })

  test.serial(`MiscError.stackTraceLimit is a noop | ${title}`, (t) => {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    PonyfillAnyError.stackTraceLimit = 0
    const error = new PonyfillAnyError(...args)
    t.true(error.stack.includes('at '))
    // eslint-disable-next-line fp/no-delete, no-param-reassign
    delete PonyfillAnyError.stackTraceLimit
  })
}

// Tests run only on the parent Type, if not "Error", for `captureStackTrace()`
const defineMiscTypeCaptTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
}) {
  if (!('captureStackTrace' in OriginalAnyError)) {
    return
  }

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
}

// Tests run only on the parent Type, if not "Error", for `prepareStackTrace()`
const defineMiscTypePrepTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) {
  if (!('prepareStackTrace' in OriginalAnyError)) {
    return
  }

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
}
