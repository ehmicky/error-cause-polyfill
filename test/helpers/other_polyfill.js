// eslint-disable-next-line n/file-extension-in-import
import OtherPolyfillTypeError from 'error-cause/TypeError/implementation'

import { getOriginalErrors } from './types.js'

const originalErrors = getOriginalErrors()

// Set another polyfill to check for conflicts
export const setOtherPolyfill = function () {
  setGlobalTypeError(OtherPolyfillTypeError)
}

// Undo `setOtherPolyfill()`
export const unsetOtherPolyfill = function () {
  setGlobalTypeError(originalErrors.TypeError)
}

export { OtherPolyfillTypeError, originalErrors }

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
