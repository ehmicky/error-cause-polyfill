import test from 'ava'
import { getErrors, hasSupport } from 'error-cause-polyfill'

import { getOriginalErrors } from './helpers/types.js'

const originalErrors = getOriginalErrors()

test('getErrors() does not modify globals', (t) => {
  getErrors()
  t.is(globalThis.Error, originalErrors.Error)
})

test('getErrors() returns globals if already supported', (t) => {
  const ponyfillErrors = getErrors()
  t.is(globalThis.Error === ponyfillErrors.Error, hasSupport())
})
