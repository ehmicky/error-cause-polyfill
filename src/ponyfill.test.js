import test from 'ava'

import {
  setOtherPolyfill,
  unsetOtherPolyfill,
  OtherPolyfillClassError,
  originalErrors,
} from './helpers/other_polyfill.test.js'

import { getErrors, hasSupport } from 'error-cause-polyfill'

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
  t.is(globalThis.TypeError, OtherPolyfillClassError)
  const ponyfillErrors = getErrors()
  t.is(
    ponyfillErrors.TypeError !== OtherPolyfillClassError &&
      Object.getPrototypeOf(ponyfillErrors.TypeError) ===
        OtherPolyfillClassError,
    lacksCause,
  )
  unsetOtherPolyfill()
  t.is(globalThis.TypeError, originalErrors.TypeError)
})

test.serial('getErrors() before another polyfill', (t) => {
  getErrors()
  t.is(globalThis.TypeError, originalErrors.TypeError)
  setOtherPolyfill()
  t.is(globalThis.TypeError, OtherPolyfillClassError)
  unsetOtherPolyfill()
  t.is(globalThis.TypeError, originalErrors.TypeError)
})

test('getErrors() should not return AggregateError unless supported', (t) => {
  t.is('AggregateError' in getErrors(), 'AggregateError' in globalThis)
})
