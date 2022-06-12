import { getErrors } from './ponyfill.js'
import { setNonEnumProp } from './set.js'
import { hasSupport } from './support.js'

// Monkey patches the global object, i.e. polyfills it.
// If another polyfill was applied on global Error types before `polyfill()`
// was called, it will be kept.
// Idempotent.
// If `error.cause` is already supported, it is a noop.
export const polyfill = function () {
  if (hasSupport()) {
    return noop
  }

  const PonyfillErrors = getErrors()
  const OriginalErrors = Object.fromEntries(
    Object.entries(PonyfillErrors).map(getOriginalAnyError),
  )
  Object.entries(PonyfillErrors).forEach(polyfillErrorType)
  return undoPolyfill.bind(undefined, OriginalErrors)
}

// eslint-disable-next-line no-empty-function
const noop = function () {}

const getOriginalAnyError = function ([name]) {
  return [name, globalThis[name]]
}

const polyfillErrorType = function ([name, PonyfillAnyError]) {
  setNonEnumProp(globalThis, name, PonyfillAnyError)
}

// `polyfill()` returns a function to undo.
// If another polyfill was applied on global Error types since `polyfill()`
// was called, it will be undone too.
// Idempotent.
// If `polyfill()` was a noop, so is `undoPolyfill()`
//  - This ensures this is purely functional
//  - For example, this would prevent from reverting any other polyfills loaded
//    afterwards
const undoPolyfill = function (OriginalErrors) {
  if (globalThis.Error === OriginalErrors.Error) {
    return
  }

  Object.entries(OriginalErrors).forEach(undoPolyfillErrorType)
}

const undoPolyfillErrorType = function ([name, OriginalAnyError]) {
  setNonEnumProp(globalThis, name, OriginalAnyError)
}
