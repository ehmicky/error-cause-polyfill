import test from 'ava'
import { polyfill, hasSupport } from 'error-cause-polyfill'

import { getOriginalErrors } from './helpers/types.js'

const originalErrors = getOriginalErrors()
const supportsCause = hasSupport()

test.serial('polyfill() is noop if already supported', (t) => {
  const undoPolyfill = polyfill()
  t.is(globalThis.Error === originalErrors.Error, supportsCause)
  undoPolyfill()
})
