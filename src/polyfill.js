import { test } from './check.js'
import { ORIGINAL_ERRORS } from './original.js'
import { PONYFILL_ERRORS } from './ponyfill.js'
import { setNonEnumProp } from './set.js'
import { ERROR_TYPES } from './types.js'

// Monkey patches the global object, i.e. polyfills it.
export const polyfill = function () {
  if (hasPolyfill() || test()) {
    return
  }

  ERROR_TYPES.forEach(polyfillErrorType)
}

const polyfillErrorType = function ({ name }) {
  setNonEnumProp(globalThis, name, PONYFILL_ERRORS[name])
}

// Undo `polyfill()`
export const undoPolyfill = function () {
  if (!hasPolyfill()) {
    return
  }

  ERROR_TYPES.forEach(undoPolyfillErrorType)
}

const undoPolyfillErrorType = function ({ name }) {
  setNonEnumProp(globalThis, name, ORIGINAL_ERRORS[name])
}

// Check whether this polyfill has already been used.
// If another `Error` polyfill is applied since this library was loaded,
// `ORIGINAL_ERRORS` will miss it
//   - i.e. applying this polyfill would remove the other polyfill
//   - Therefore, this becomes a noop
// TODO: improve this so it is not a noop
const hasPolyfill = function () {
  return globalThis.Error !== ORIGINAL_ERRORS.Error
}
