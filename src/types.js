// We do not polyfill `AggregateError`. If unsupported, those exports are
// `undefined`.
// Any `AggregateError` polyfill must be loaded first.
const hasAggregateError = function () {
  try {
    // eslint-disable-next-line no-unused-expressions
    AggregateError
    return true
  } catch {
    return false
  }
}

export const ERROR_TYPES = [
  { name: 'Error', shouldProxy: true, argsLength: 1 },
  { name: 'ReferenceError', shouldProxy: false, argsLength: 1 },
  { name: 'TypeError', shouldProxy: false, argsLength: 1 },
  { name: 'SyntaxError', shouldProxy: false, argsLength: 1 },
  { name: 'RangeError', shouldProxy: false, argsLength: 1 },
  { name: 'URIError', shouldProxy: false, argsLength: 1 },
  { name: 'EvalError', shouldProxy: false, argsLength: 1 },
  {
    name: 'AggregateError',
    shouldProxy: false,
    argsLength: 2,
    condition: hasAggregateError,
  },
]
