// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

import { ERROR_TYPES } from './types.js'

export const defineAllTests = function (getTypes) {
  // eslint-disable-next-line fp/no-loops
  for (const { name, args } of ERROR_TYPES) {
    defineTests({ name, args, getTypes })
  }
}

const defineTests = function ({ name, args, getTypes }) {
  const { ErrorType, OriginalAnyError } = getTypes(name)

  const message = 'test'
  const error = new ErrorType(...args, message)

  test(`Is instance of original Error | ${name}`, (t) => {
    t.true(error instanceof OriginalAnyError)
  })
}
