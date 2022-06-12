import { ORIGINAL_ERRORS } from './original.js'
import { PONYFILL_ERRORS } from './ponyfill.js'

export { polyfill, unpolyfill } from './polyfill.js'
export { test } from './check.js'

export const OriginalError = ORIGINAL_ERRORS.Error
export const OriginalReferenceError = ORIGINAL_ERRORS.ReferenceError
export const OriginalTypeError = ORIGINAL_ERRORS.TypeError
export const OriginalSyntaxError = ORIGINAL_ERRORS.SyntaxError
export const OriginalRangeError = ORIGINAL_ERRORS.RangeError
export const OriginalURIError = ORIGINAL_ERRORS.URIError
export const OriginalEvalError = ORIGINAL_ERRORS.EvalError
export const OriginalAggregateError = ORIGINAL_ERRORS.AggregateError

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
