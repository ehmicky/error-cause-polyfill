// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

// Tests run on the parent and child error instances, related to `error.stack`
export const defineStackTests = function (title, error, OriginalAnyError) {
  test(`error.stack includes name and message | ${title}`, (t) => {
    t.true(error.stack.includes(error.toString()))
  })

  test(`error.stack includes stack trace | ${title}`, (t) => {
    t.true(error.stack.includes('at '))
    t.true(error.stack.includes('helpers'))
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
