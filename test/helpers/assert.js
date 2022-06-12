import assert from 'assert/strict'

import { hasSupport, polyfill } from 'error-cause-polyfill'

import { getOriginalErrors } from './types.js'

const OriginalErrors = getOriginalErrors()

const hasPolyfill = function () {
  return globalThis.Error !== OriginalErrors.Error
}

const testWithoutPolyfill = hasSupport()
assert(!hasPolyfill())
const undoPolyfill = polyfill()
assert.equal(!hasPolyfill(), testWithoutPolyfill)
assert(hasSupport())
undoPolyfill()
assert(!hasPolyfill())
