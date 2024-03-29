// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

// Tests run only on the parent class, whether "Error" or not
export const defineAnyClassTests = ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
}) => {
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

  test.serial(
    `Original Error static properties are inherited | ${title}`,
    (t) => {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      OriginalAnyError.prop = true
      t.true(PonyfillAnyError.prop)
      // eslint-disable-next-line fp/no-delete, no-param-reassign
      delete OriginalAnyError.prop
    },
  )

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

  test(`Global Error has right descriptors | ${title}`, (t) => {
    t.deepEqual(
      Object.getOwnPropertyDescriptor(globalThis, PonyfillAnyError.name),
      {
        value: globalThis[PonyfillAnyError.name],
        writable: true,
        enumerable: false,
        configurable: true,
      },
    )
  })
}
