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
  { name: 'Error', args: [] },
  { name: 'ReferenceError', args: [] },
  { name: 'TypeError', args: [] },
  { name: 'SyntaxError', args: [] },
  { name: 'RangeError', args: [] },
  { name: 'URIError', args: [] },
  { name: 'EvalError', args: [] },
  ...(hasAggregateError() ? [{ name: 'AggregateError', args: [[]] }] : []),
]
