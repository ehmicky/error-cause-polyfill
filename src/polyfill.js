import {
  OriginalError,
  OriginalReferenceError,
  OriginalTypeError,
  OriginalSyntaxError,
  OriginalRangeError,
  OriginalURIError,
  OriginalEvalError,
  OriginalAggregateError,
} from './original.js'
import {
  PonyfillError,
  PonyfillReferenceError,
  PonyfillTypeError,
  PonyfillSyntaxError,
  PonyfillRangeError,
  PonyfillURIError,
  PonyfillEvalError,
  PonyfillAggregateError,
} from './ponyfill.js'

// Monkey patches the global object, i.e. polyfills it.
export const polyfill = function () {
  if (hasPolyfill() || test()) {
    return
  }

  setGlobalErrorType('Error', PonyfillError)
  setGlobalErrorType('ReferenceError', PonyfillReferenceError)
  setGlobalErrorType('TypeError', PonyfillTypeError)
  setGlobalErrorType('SyntaxError', PonyfillSyntaxError)
  setGlobalErrorType('RangeError', PonyfillRangeError)
  setGlobalErrorType('URIError', PonyfillURIError)
  setGlobalErrorType('EvalError', PonyfillEvalError)

  if (PonyfillAggregateError !== undefined) {
    setGlobalErrorType('AggregateError', PonyfillAggregateError)
  }
}

// Undo `polyfill()`
export const unpolyfill = function () {
  if (!hasPolyfill()) {
    return
  }

  setGlobalErrorType('Error', OriginalError)
  setGlobalErrorType('ReferenceError', OriginalReferenceError)
  setGlobalErrorType('TypeError', OriginalTypeError)
  setGlobalErrorType('SyntaxError', OriginalSyntaxError)
  setGlobalErrorType('RangeError', OriginalRangeError)
  setGlobalErrorType('URIError', OriginalURIError)
  setGlobalErrorType('EvalError', OriginalEvalError)

  if (OriginalAggregateError !== undefined) {
    setGlobalErrorType('AggregateError', OriginalAggregateError)
  }
}

const setGlobalErrorType = function (propName, value) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(globalThis, propName, {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  })
}

// Handle case where another polyfill is used
const hasPolyfill = function () {
  return globalThis.Error !== OriginalError
}
