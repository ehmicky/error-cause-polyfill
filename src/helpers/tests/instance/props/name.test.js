// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

// Tests run on the parent and child error instances, related to `error.name`
export const defineNameTests = (title, error, PonyfillAnyError) => {
  test(`error.name is correct | ${title}`, (t) => {
    t.is(error.name, PonyfillAnyError.name)
  })

  test(`error.name is inherited | ${title}`, (t) => {
    t.false(Object.hasOwn(error, 'name'))
    t.true(Object.hasOwn(Object.getPrototypeOf(error), 'name'))
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
