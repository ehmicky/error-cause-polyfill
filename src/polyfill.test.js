import test from 'ava'

import {
  originalErrors,
  OtherPolyfillClassError,
  setOtherPolyfill,
  unsetOtherPolyfill,
} from './helpers/other_polyfill.test.js'

import { hasSupport, polyfill } from 'error-cause-polyfill'

const lacksCause = !hasSupport()

test.serial('polyfill() patches globals unless already supported', (t) => {
  const undoPolyfill = polyfill()
  t.is(globalThis.Error !== originalErrors.Error, lacksCause)
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
  t.is(globalThis.Error !== originalErrors.Error, lacksCause)
  undoPolyfillTwo()
  t.is(globalThis.Error !== originalErrors.Error, lacksCause)
  undoPolyfill()
  t.is(globalThis.Error, originalErrors.Error)
})

test.serial('Can polyfill after another polyfill', (t) => {
  t.is(globalThis.TypeError, originalErrors.TypeError)
  setOtherPolyfill()
  t.is(globalThis.TypeError, OtherPolyfillClassError)
  const undoPolyfill = polyfill()
  t.is(
    globalThis.TypeError !== OtherPolyfillClassError &&
      Object.getPrototypeOf(globalThis.TypeError) === OtherPolyfillClassError,
    lacksCause,
  )
  undoPolyfill()
  t.is(globalThis.TypeError, OtherPolyfillClassError)
  unsetOtherPolyfill()
  t.is(globalThis.TypeError, originalErrors.TypeError)
})

test.serial('Can polyfill before another polyfill', (t) => {
  t.is(globalThis.TypeError, originalErrors.TypeError)
  const undoPolyfill = polyfill()
  t.is(globalThis.TypeError !== originalErrors.TypeError, lacksCause)
  setOtherPolyfill()
  t.is(globalThis.TypeError, OtherPolyfillClassError)
  // `error-cause` polyfill `TypeError` inherits from original `Error`, not
  // from original `TypeError`
  t.is(
    Object.getPrototypeOf(globalThis.TypeError) !== originalErrors.Error,
    lacksCause,
  )
  undoPolyfill()
  t.is(globalThis.TypeError !== OtherPolyfillClassError, lacksCause)
})

test.serial(
  'polyfill() should not patch AggregateError unless supported',
  (t) => {
    const hasAggregateErrorBefore = 'AggregateError' in globalThis
    const undoPolyfill = polyfill()
    t.is(hasAggregateErrorBefore, 'AggregateError' in globalThis)
    undoPolyfill()
    t.is(hasAggregateErrorBefore, 'AggregateError' in globalThis)
  },
)
