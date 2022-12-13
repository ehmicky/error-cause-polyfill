// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

// Tests run on the parent and child error instances, related to prototype or
// constructor
export const defineInstanceProtoTests = ({
  title,
  error,
  PonyfillAnyError,
  PonyfillBaseError,
  OriginalAnyError,
  OriginalBaseError,
}) => {
  test(`Is instance of original base Error | ${title}`, (t) => {
    t.true(error instanceof OriginalBaseError)
  })

  test(`Is instance of ponyfill base Error | ${title}`, (t) => {
    t.true(error instanceof PonyfillBaseError)
  })

  test(`Is instance of original Error | ${title}`, (t) => {
    t.true(error instanceof OriginalAnyError)
  })

  test(`Is instance of ponyfill Error | ${title}`, (t) => {
    t.true(error instanceof PonyfillAnyError)
  })

  test(`__proto__ is constructor's prototype | ${title}`, (t) => {
    t.is(Object.getPrototypeOf(error), PonyfillAnyError.prototype)
  })

  test(`constructor is correct | ${title}`, (t) => {
    t.is(error.constructor, PonyfillAnyError)
  })

  test(`constructor has right descriptors | ${title}`, (t) => {
    t.deepEqual(getPropertyDescriptor(error, 'constructor'), {
      value: error.constructor,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })
}

// Return property descriptor that is own or is inherited from direct parent
const getPropertyDescriptor = (object, propName) =>
  Object.getOwnPropertyDescriptor(object, propName) ||
  Object.getOwnPropertyDescriptor(Object.getPrototypeOf(object), propName)
