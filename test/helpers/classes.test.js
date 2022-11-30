// Retrieve original errors before polyfilling
export const getOriginalErrors = function () {
  return Object.fromEntries(ERROR_CLASSES.map(getOriginalAnyError))
}

const getOriginalAnyError = function (name) {
  return [name, globalThis[name]]
}

// We do not polyfill `AggregateError` unless supported.
// Any `AggregateError` polyfill must be loaded first.
export const ERROR_CLASSES = [
  'Error',
  'ReferenceError',
  'TypeError',
  'SyntaxError',
  'RangeError',
  'URIError',
  'EvalError',
  ...('AggregateError' in globalThis ? ['AggregateError'] : []),
]
