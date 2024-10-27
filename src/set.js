// Set non-enumerable property
export const setNonEnumProp = (object, propName, value) => {
  Object.defineProperty(object, propName, {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  })
}

// Set non-enumerable and non-writable property
export const setNonEnumReadonlyProp = (object, propName, value) => {
  Object.defineProperty(object, propName, {
    value,
    writable: false,
    enumerable: false,
    configurable: true,
  })
}

// Set non-enumerable, non-writable and non-configurable property
export const setFrozenProp = (object, propName, value) => {
  Object.defineProperty(object, propName, {
    value,
    writable: false,
    enumerable: false,
    configurable: false,
  })
}
