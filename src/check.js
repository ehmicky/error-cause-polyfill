// Returns whether `error.cause` is supported.
export const test = function () {
  const symbol = Symbol('')
  const error = new Error('test', { cause: symbol })
  return 'cause' in error && error.cause === symbol
}
