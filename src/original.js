import { ERROR_TYPES } from './types.js'

const getOriginalErrors = function () {
  return Object.fromEntries(ERROR_TYPES.map(getOriginalAnyError))
}

const getOriginalAnyError = function ({ name }) {
  return [name, globalThis[name]]
}

export const ORIGINAL_ERRORS = getOriginalErrors()
