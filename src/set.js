// Set non-enumerable property
export const setNonEnumProp = function (object, propName, value) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(object, propName, {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  })
}

// Set non-enumerable and non-writable property
export const setNonEnumReadonlyProp = function (object, propName, value) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(object, propName, {
    value,
    writable: false,
    enumerable: false,
    configurable: true,
  })
}

// Set non-enumerable, non-writable and non-configurable property
export const setFrozenProp = function (object, propName, value) {
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(object, propName, {
    value,
    writable: false,
    enumerable: false,
    configurable: false,
  })
}
