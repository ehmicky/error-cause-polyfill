import OtherPolyfillClassError from 'error-cause/TypeError/implementation'

import { getOriginalErrors } from './classes.test.js'

const originalErrors = getOriginalErrors()

// Set another polyfill to check for conflicts
export const setOtherPolyfill = () => {
  setGlobalClassError(OtherPolyfillClassError)
}

// Undo `setOtherPolyfill()`
export const unsetOtherPolyfill = () => {
  setGlobalClassError(originalErrors.TypeError)
}

export { OtherPolyfillClassError, originalErrors }

// Use TypeError so we can polyfill it without impacting `hasSupport()`
// return value.
const setGlobalClassError = (value) => {
  Object.defineProperty(globalThis, 'TypeError', {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  })
}
