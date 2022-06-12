import test from 'ava'
import { polyfill, hasSupport } from 'error-cause-polyfill'

import { getOriginalErrors } from './helpers/types.js'

const originalErrors = getOriginalErrors()
const supportsCause = hasSupport()

test.serial('polyfill() patches globals unless already supported', (t) => {
  const undoPolyfill = polyfill()
  t.is(globalThis.Error === originalErrors.Error, supportsCause)
  undoPolyfill()
})

test.serial('polyfill() adds support for error.cause', (t) => {
  const undoPolyfill = polyfill()
  t.true(hasSupport())
  undoPolyfill()
})

test.serial('polyfill() can be undone', (t) => {
  const undoPolyfill = polyfill()
  undoPolyfill()
  t.is(globalThis.Error, originalErrors.Error)
})

test.serial('polyfill() can be undone twice', (t) => {
  const undoPolyfill = polyfill()
  undoPolyfill()
  undoPolyfill()
  t.is(globalThis.Error, originalErrors.Error)
})
