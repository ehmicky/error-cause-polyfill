// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

// Tests run on the parent and child error instances, if "AggregateError"
export const defineAggInstanceTests = function (title, error, errors) {
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
