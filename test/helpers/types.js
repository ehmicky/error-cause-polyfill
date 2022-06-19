// Retrieve original errors before polyfilling
export const getOriginalErrors = function () {
  return Object.fromEntries(ERROR_TYPES.map(getOriginalAnyError))
}

const getOriginalAnyError = function (name) {
  return [name, globalThis[name]]
}

// We do not polyfill `AggregateError` unless supported.
// Any `AggregateError` polyfill must be loaded first.
export const ERROR_TYPES = [
  'Error',
  'ReferenceError',
  'TypeError',
  'SyntaxError',
  'RangeError',
  'URIError',
  'EvalError',
  ...('AggregateError' in globalThis ? ['AggregateError'] : []),
]
