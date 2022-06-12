import { getPonyfillAnyError } from './create.js'
import {
  OriginalError,
  OriginalReferenceError,
  OriginalTypeError,
  OriginalSyntaxError,
  OriginalRangeError,
  OriginalURIError,
  OriginalEvalError,
  OriginalAggregateError,
} from './original.js'
import { hasAggregateError } from './test.js'

// The ponyfilled error types reference the original error types, so are not
// impacted by any other similar ponyfill being applied later.
export const PonyfillError = getPonyfillAnyError(OriginalError, true, 1)
export const PonyfillReferenceError = getPonyfillAnyError(
  OriginalReferenceError,
  false,
  1,
)
export const PonyfillTypeError = getPonyfillAnyError(
  OriginalTypeError,
  false,
  1,
)
export const PonyfillSyntaxError = getPonyfillAnyError(
  OriginalSyntaxError,
  false,
  1,
)
export const PonyfillRangeError = getPonyfillAnyError(
  OriginalRangeError,
  false,
  1,
)
export const PonyfillURIError = getPonyfillAnyError(OriginalURIError, false, 1)
export const PonyfillEvalError = getPonyfillAnyError(
  OriginalEvalError,
  false,
  1,
)
export const PonyfillAggregateError = hasAggregateError()
  ? getPonyfillAnyError(OriginalAggregateError, false, 2)
  : undefined
