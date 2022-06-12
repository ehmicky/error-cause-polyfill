// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

const { propertyIsEnumerable: isEnum } = Object.prototype

// Tests run only on the parent Type
export const defineTypeTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
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

  if (PonyfillAnyError.name === 'Error') {
    defineBaseTypeTests({ title, PonyfillAnyError, OriginalAnyError, args })
  } else {
    defineMiscTypeTests({ title, PonyfillAnyError, args })
  }
}

// Tests run only on the parent Type, if "Error"
const defineBaseTypeTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) {
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

// Tests run only on the parent Type, if not "Error"
const defineMiscTypeTests = function ({ title, PonyfillAnyError, args }) {
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
