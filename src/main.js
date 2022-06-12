import { PONYFILL_ERRORS } from './ponyfill.js'

export { originalErrors } from './original.js'
export { polyfill, undoPolyfill } from './polyfill.js'
export { test } from './check.js'

/* eslint-disable no-shadow */
export const { Error } = PONYFILL_ERRORS
export const { ReferenceError } = PONYFILL_ERRORS
export const { TypeError } = PONYFILL_ERRORS
export const { SyntaxError } = PONYFILL_ERRORS
export const { RangeError } = PONYFILL_ERRORS
export const { URIError } = PONYFILL_ERRORS
export const { EvalError } = PONYFILL_ERRORS
export const { AggregateError } = PONYFILL_ERRORS
/* eslint-enable no-shadow */
