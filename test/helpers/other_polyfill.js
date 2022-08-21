// eslint-disable-next-line n/file-extension-in-import
import OtherPolyfillClassError from 'error-cause/TypeError/implementation'

import { getOriginalErrors } from './classes.js'

const originalErrors = getOriginalErrors()

// Set another polyfill to check for conflicts
export const setOtherPolyfill = function () {
  setGlobalClassError(OtherPolyfillClassError)
}

// Undo `setOtherPolyfill()`
export const unsetOtherPolyfill = function () {
  setGlobalClassError(originalErrors.TypeError)
}

export { OtherPolyfillClassError, originalErrors }

// Use TypeError so we can polyfill it without impacting `hasSupport()`
// return value.
const setGlobalClassError = function (value) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(globalThis, 'TypeError', {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  })
}
