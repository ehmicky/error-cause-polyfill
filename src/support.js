// Returns whether `error.cause` is supported.
export const hasSupport = function () {
  const cause = Symbol('')
  return new Error('test', { cause }).cause === cause
}
