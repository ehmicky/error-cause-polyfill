// eslint-disable-next-line ava/no-ignored-test-files
import { types } from 'node:util'

import test from 'ava'

export const defineInstanceMiscTests = function ({
  title,
  error,
  PonyfillAnyError,
}) {
  test(`error.toString() returns name and message | ${title}`, (t) => {
    t.is(error.toString(), `${PonyfillAnyError.name}: ${error.message}`)
  })

  test(`Object.prototype.toString.call() is correct | ${title}`, (t) => {
    t.is(Object.prototype.toString.call(error), '[object Error]')
  })

  test(`Keeps error internal slots | ${title}`, (t) => {
    t.true(types.isNativeError(error))
  })
}
