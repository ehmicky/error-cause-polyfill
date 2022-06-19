// We do not polyfill `AggregateError`. If unsupported, those exports are
// `undefined`.
// Any `AggregateError` polyfill must be loaded first.
export const hasAggregateError = function () {
  try {
    // eslint-disable-next-line no-unused-expressions
    AggregateError
    return true
  } catch {
    return false
  }
}

export const ERROR_TYPES = [
  'Error',
  'ReferenceError',
  'TypeError',
  'SyntaxError',
  'RangeError',
  'URIError',
  'EvalError',
  ...(hasAggregateError() ? ['AggregateError'] : []),
]

// Retrieve original errors before polyfilling
export const getOriginalErrors = function () {
  return Object.fromEntries(ERROR_TYPES.map(getOriginalAnyError))
}

const getOriginalAnyError = function (name) {
  return [name, globalThis[name]]
}
