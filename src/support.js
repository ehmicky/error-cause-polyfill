// Returns whether `error.cause` is supported.
export const hasSupport = function () {
  const symbol = Symbol('')
  const error = new Error('test', { cause: symbol })
  return error.cause === symbol
}
