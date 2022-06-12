// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

const { hasOwnProperty: hasOwn } = Object.prototype

// Tests run on the parent and child error instances, related to core error
// instance properties: name|message|stack|cause|errors
export const defineInstancePropsTests = function ({
  title,
  error,
  PonyfillAnyError,
  OriginalAnyError,
  supportsCause,
  errors,
  message,
  cause,
}) {
  defineNameTests(title, error, PonyfillAnyError)
  defineMessageTests(title, error, message)
  defineStackTests(title, error, OriginalAnyError)
  defineCauseTests({ title, error, supportsCause, cause })
  defineErrorsTests({ title, error, errors, PonyfillAnyError })
}

// Tests run on the parent and child error instances, related to `error.name`
const defineNameTests = function (title, error, PonyfillAnyError) {
  test(`error.name is correct | ${title}`, (t) => {
    t.is(error.name, PonyfillAnyError.name)
  })

  test(`error.name is inherited | ${title}`, (t) => {
    t.false(hasOwn.call(error, 'name'))
    t.true(hasOwn.call(Object.getPrototypeOf(error), 'name'))
  })

  test(`error.name has right descriptors | ${title}`, (t) => {
    t.deepEqual(
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(error), 'name'),
      {
        value: error.name,
        writable: true,
        enumerable: false,
        configurable: true,
      },
    )
  })
}

// Tests run on the parent and child error instances, related to `error.message`
const defineMessageTests = function (title, error, message) {
  test(`error.message is correct | ${title}`, (t) => {
    t.is(error.message, message)
  })

  test(`error.message has right descriptors | ${title}`, (t) => {
    t.deepEqual(Object.getOwnPropertyDescriptor(error, 'message'), {
      value: error.message,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })
}

// Tests run on the parent and child error instances, related to `error.stack`
const defineStackTests = function (title, error, OriginalAnyError) {
  test(`error.stack includes name and message | ${title}`, (t) => {
    t.true(error.stack.includes(error.toString()))
  })

  test(`error.stack includes stack trace | ${title}`, (t) => {
    t.true(error.stack.includes('at '))
    t.true(error.stack.includes('helpers/'))
  })

  test(`error.stack does not include this library's internal code | ${title}`, (t) => {
    const lines = error.stack.split('\n')
    const firstLineIndex = lines.findIndex(isStackLine)
    t.true(
      lines[firstLineIndex].includes('getInstanceKinds') ||
        !('captureStackTrace' in OriginalAnyError),
    )
  })

  test(`error.stack has right descriptors | ${title}`, (t) => {
    t.deepEqual(Object.getOwnPropertyDescriptor(error, 'stack'), {
      value: error.stack,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })
}

const isStackLine = function (line) {
  return line.trim().startsWith('at ')
}

// Tests run on the parent and child error instances, related to `error.cause`
const defineCauseTests = function ({ title, error, supportsCause, cause }) {
  test(`error.cause is patched | ${title}`, (t) => {
    t.is(error.cause === cause, supportsCause)
  })

  test(`error.cause has right descriptors | ${title}`, (t) => {
    t.deepEqual(
      Object.getOwnPropertyDescriptor(error, 'cause'),
      supportsCause
        ? {
            value: error.cause,
            writable: true,
            enumerable: false,
            configurable: true,
          }
        : undefined,
    )
  })
}

// Tests run on the parent and child error instances, related to `error.errors`
const defineErrorsTests = function ({
  title,
  error,
  errors,
  PonyfillAnyError,
}) {
  if (PonyfillAnyError.name !== 'AggregateError') {
    return
  }

  test(`error.errors is correct | ${title}`, (t) => {
    t.deepEqual(error.errors, errors[0])
  })

  test(`error.errors has right descriptors | ${title}`, (t) => {
    t.deepEqual(Object.getOwnPropertyDescriptor(error, 'errors'), {
      value: error.errors,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })
}
