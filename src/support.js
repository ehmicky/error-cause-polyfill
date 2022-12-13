// Returns whether `error.cause` is supported.
export const hasSupport = () => {
  const cause = Symbol('')
  return new Error('test', { cause }).cause === cause
}
