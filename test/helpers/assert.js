import assert from 'assert/strict'

import { test, polyfill } from 'error-cause-polyfill'

import { getOriginalErrors } from './types.js'

const OriginalErrors = getOriginalErrors()

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
