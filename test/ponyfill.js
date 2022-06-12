import test from 'ava'
import { getErrors } from 'error-cause-polyfill'

import { getOriginalErrors } from './helpers/types.js'

const originalErrors = getOriginalErrors()

test('getErrors() does not modify globals', (t) => {
  getErrors()
  t.is(globalThis.Error, originalErrors.Error)
})
