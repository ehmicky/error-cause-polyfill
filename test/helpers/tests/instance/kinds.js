// Run each test on the ErrorType, but also a child and grand child of it.
// Also run with and without `new` for the base type.
export const getInstanceKinds = function (PonyfillAnyError, args) {
  const ChildError = getChildError(PonyfillAnyError)
  const GrandChildError = getChildError(ChildError)
  return {
    NewErrorType: {
      PonyfillAnyError,
      error: new PonyfillAnyError(...args),
    },
    BareErrorType: {
      PonyfillAnyError,
      error: PonyfillAnyError(...args),
    },
    ChildError: {
      PonyfillAnyError: ChildError,
      error: new ChildError(...args),
    },
    GrandChildError: {
      PonyfillAnyError: GrandChildError,
      error: new GrandChildError(...args),
    },
  }
}

const getChildError = function (ParentError) {
  // eslint-disable-next-line fp/no-class
  class ChildError extends ParentError {}
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(ChildError.prototype, 'name', {
    value: ChildError.name,
    writable: true,
    enumerable: false,
    configurable: true,
  })
  return ChildError
}
