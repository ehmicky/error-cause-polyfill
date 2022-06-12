import { ORIGINAL_ERRORS } from './original.js'

export { polyfill, unpolyfill } from './polyfill.js'
export {
  PonyfillError as Error,
  PonyfillReferenceError as ReferenceError,
  PonyfillTypeError as TypeError,
  PonyfillSyntaxError as SyntaxError,
  PonyfillRangeError as RangeError,
  PonyfillURIError as URIError,
  PonyfillEvalError as EvalError,
  PonyfillAggregateError as AggregateError,
} from './ponyfill.js'
export { test } from './test.js'

export const OriginalError = ORIGINAL_ERRORS.Error
export const OriginalReferenceError = ORIGINAL_ERRORS.ReferenceError
export const OriginalTypeError = ORIGINAL_ERRORS.TypeError
export const OriginalSyntaxError = ORIGINAL_ERRORS.SyntaxError
export const OriginalRangeError = ORIGINAL_ERRORS.RangeError
export const OriginalURIError = ORIGINAL_ERRORS.URIError
export const OriginalEvalError = ORIGINAL_ERRORS.EvalError
export const OriginalAggregateError = ORIGINAL_ERRORS.AggregateError
