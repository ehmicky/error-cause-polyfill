/* eslint-disable max-depth */
import assert from 'assert/strict'

import { getErrors, test, polyfill } from 'error-cause-polyfill'

import { getOriginalErrors } from './types.js'

const OriginalErrors = getOriginalErrors()
const PonyfillErrors = getErrors()

const ALL_ERRORS = [
  [OriginalErrors.Error, PonyfillErrors.Error],
  [OriginalErrors.ReferenceError, PonyfillErrors.ReferenceError],
  [OriginalErrors.TypeError, PonyfillErrors.TypeError],
  [OriginalErrors.SyntaxError, PonyfillErrors.SyntaxError],
  [OriginalErrors.RangeError, PonyfillErrors.RangeError],
  [OriginalErrors.URIError, PonyfillErrors.URIError],
  [OriginalErrors.EvalError, PonyfillErrors.EvalError],
  ...(AggregateError === undefined
    ? []
    : [[OriginalErrors.AggregateError, PonyfillErrors.AggregateError]]),
]

// eslint-disable-next-line fp/no-loops
for (const [OriginalAnyError, PonyfillAnyError] of ALL_ERRORS) {
  if (OriginalAnyError.name === 'Error') {
    assert.notEqual(PonyfillAnyError.stackTraceLimit, undefined)

    if (PonyfillAnyError.stackTraceLimit !== undefined) {
      const oldStackTraceLimit = PonyfillAnyError.stackTraceLimit
      // eslint-disable-next-line fp/no-mutation
      PonyfillAnyError.stackTraceLimit = 0
      assert.equal(
        new PonyfillAnyError('').stack,
        PonyfillAnyError.prototype.name,
      )
      // eslint-disable-next-line fp/no-mutation
      PonyfillAnyError.stackTraceLimit = oldStackTraceLimit
    }

    // eslint-disable-next-line fp/no-mutation
    PonyfillAnyError.prepareStackTrace = () => 'stack'
    assert.equal(new PonyfillAnyError('').stack, 'stack')
    // eslint-disable-next-line fp/no-mutation
    PonyfillAnyError.prepareStackTrace = undefined
  }
}

const hasPolyfill = function () {
  return globalThis.Error !== OriginalErrors.Error
}

const testWithoutPolyfill = test()
assert(!hasPolyfill())
const undoPolyfill = polyfill()
assert.equal(!hasPolyfill(), testWithoutPolyfill)
assert(test())
undoPolyfill()
assert(!hasPolyfill())
/* eslint-enable max-depth */
