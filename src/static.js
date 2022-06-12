// When getting|setting `PonyfillAnyError.*` static properties, get|set
// `OriginalAnyError.*` instead.
// This ensures that any code that relies on `OriginalAnyError.*` also gets any
// new values.
// For example, Node.js does so, so this is required for
// `Error.stackTrackLimit|captureStackTrace|prepareStackTrace()`
// Since we cannot use a `Proxy`, we have to use a list of known static
// properties.
// Some static properties are engine specific.
// Those properties are only defined on `Error.*`, not `TypeError.*`, etc.
//  - Setting them have no effect on `TypeError.*`, etc.
//  - `captureStackTrace()` does work but it's because it is inherited, and it
//    uses `Error` name, not `TypeError`, etc.
export const proxyStaticProperties = function (
  PonyfillAnyError,
  OriginalAnyError,
  shouldProxy,
) {
  if (!shouldProxy) {
    return
  }

  STATIC_PROPERTIES.forEach((staticProperty) => {
    proxyStaticProperty(staticProperty, PonyfillAnyError, OriginalAnyError)
  })
}

const STATIC_PROPERTIES = [
  {
    propName: 'stackTraceLimit',
    testPropName: 'stackTraceLimit',
    enumerable: true,
  },
  {
    propName: 'captureStackTrace',
    testPropName: 'captureStackTrace',
    enumerable: false,
  },
  {
    propName: 'prepareStackTrace',
    testPropName: 'captureStackTrace',
    enumerable: false,
  },
]

const proxyStaticProperty = function (
  { propName, testPropName, enumerable },
  PonyfillAnyError,
  OriginalAnyError,
) {
  if (!(testPropName in OriginalAnyError)) {
    return
  }

  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(PonyfillAnyError, propName, {
    get() {
      return OriginalAnyError[propName]
    },
    set(value) {
      // eslint-disable-next-line fp/no-mutation, no-param-reassign
      OriginalAnyError[propName] = value
    },
    enumerable,
    configurable: true,
  })
}
