import test from 'ava'
import { polyfill, hasSupport } from 'error-cause-polyfill'
// eslint-disable-next-line n/file-extension-in-import
import OtherPolyfillTypeError from 'error-cause/TypeError/implementation'

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
  t.is(globalThis.TypeError, originalErrors.TypeError)
  setOtherPolyfill()
  t.is(globalThis.TypeError, OtherPolyfillTypeError)
  const undoPolyfill = polyfill()
  t.is(
    globalThis.TypeError === OtherPolyfillTypeError &&
      Object.getPrototypeOf(globalThis.TypeError) !== OtherPolyfillTypeError,
    supportsCause,
  )
  undoPolyfill()
  t.is(globalThis.TypeError, OtherPolyfillTypeError)
  unsetOtherPolyfill()
  t.is(globalThis.TypeError, originalErrors.TypeError)
})

test.serial('Can polyfill before another polyfill', (t) => {
  t.is(globalThis.TypeError, originalErrors.TypeError)
  const undoPolyfill = polyfill()
  t.is(globalThis.TypeError === originalErrors.TypeError, supportsCause)
  setOtherPolyfill()
  t.is(globalThis.TypeError, OtherPolyfillTypeError)
  undoPolyfill()
  t.is(globalThis.TypeError === OtherPolyfillTypeError, supportsCause)
})

const setOtherPolyfill = function () {
  setGlobalTypeError(OtherPolyfillTypeError)
}

const unsetOtherPolyfill = function () {
  setGlobalTypeError(originalErrors.TypeError)
}

const setGlobalTypeError = function (value) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(globalThis, 'TypeError', {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  })
}
