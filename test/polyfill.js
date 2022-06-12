import test from 'ava'
import { polyfill, hasSupport } from 'error-cause-polyfill'
// eslint-disable-next-line n/file-extension-in-import
import OtherPolyfillError from 'error-cause/Error/implementation'

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

test.serial('polyfill() can be done twice', (t) => {
  const undoPolyfill = polyfill()
  const undoPolyfillTwo = polyfill()
  t.is(globalThis.Error === originalErrors.Error, supportsCause)
  undoPolyfillTwo()
  t.is(globalThis.Error === originalErrors.Error, supportsCause)
  undoPolyfill()
  t.is(globalThis.Error, originalErrors.Error)
})

test.serial('Can polyfill after another polyfill', (t) => {
  t.is(Error, originalErrors.Error)
  setOtherPolyfill()
  t.is(Error, OtherPolyfillError)
  const undoPolyfill = polyfill()
  undoPolyfill()
  t.is(Error, OtherPolyfillError)
  unsetOtherPolyfill()
  t.is(Error, originalErrors.Error)
})

const setOtherPolyfill = function () {
  setGlobalError(OtherPolyfillError)
}

const unsetOtherPolyfill = function () {
  setGlobalError(originalErrors.Error)
}

const setGlobalError = function (value) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(globalThis, 'Error', {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  })
}
