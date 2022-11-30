// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

const { hasOwnProperty: hasOwn } = Object.prototype

// Tests run on the parent and child error instances, related to `error.name`
export const defineNameTests = function (title, error, PonyfillAnyError) {
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
