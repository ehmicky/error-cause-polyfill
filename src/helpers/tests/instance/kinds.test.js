// Run each test on the Error class, but also a child and grand child of it.
// Also run with and without `new` for the base class.
export const getInstanceKinds = (PonyfillAnyError, args) => {
  const ChildError = getChildError(PonyfillAnyError)
  const GrandChildError = getChildError(ChildError)
  return {
    NewErrorClass: {
      PonyfillAnyError,
      error: new PonyfillAnyError(...args),
    },
    BareErrorClass: {
      PonyfillAnyError,
      // eslint-disable-next-line new-cap
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

const getChildError = (ParentError) => {
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
