import test from 'ava'
import { getErrors, hasSupport } from 'error-cause-polyfill'
// eslint-disable-next-line n/file-extension-in-import
import OtherPolyfillTypeError from 'error-cause/TypeError/implementation'

import { getOriginalErrors } from './helpers/types.js'

const originalErrors = getOriginalErrors()
const lacksCause = !hasSupport()

test('getErrors() does not modify globals', (t) => {
  getErrors()
  t.is(globalThis.Error, originalErrors.Error)
})

test('getErrors() returns globals if already supported', (t) => {
  const ponyfillErrors = getErrors()
  t.is(globalThis.Error !== ponyfillErrors.Error, lacksCause)
})

test.serial('getErrors() after another polyfill', (t) => {
  t.is(globalThis.TypeError, originalErrors.TypeError)
  setOtherPolyfill()
  t.is(globalThis.TypeError, OtherPolyfillTypeError)
  const ponyfillErrors = getErrors()
  t.is(
    ponyfillErrors.TypeError !== OtherPolyfillTypeError &&
      Object.getPrototypeOf(ponyfillErrors.TypeError) ===
        OtherPolyfillTypeError,
    lacksCause,
  )
  unsetOtherPolyfill()
  t.is(globalThis.TypeError, originalErrors.TypeError)
})

test.serial('getErrors() before another polyfill', (t) => {
  getErrors()
  t.is(globalThis.TypeError, originalErrors.TypeError)
  setOtherPolyfill()
  t.is(globalThis.TypeError, OtherPolyfillTypeError)
  unsetOtherPolyfill()
  t.is(globalThis.TypeError, originalErrors.TypeError)
})

const setOtherPolyfill = function () {
  setGlobalTypeError(OtherPolyfillTypeError)
}

const unsetOtherPolyfill = function () {
  setGlobalTypeError(originalErrors.TypeError)
}

// Use TypeError so we can polyfill it without impacting `hasSupport()`
// return value.
const setGlobalTypeError = function (value) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(globalThis, 'TypeError', {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  })
}
