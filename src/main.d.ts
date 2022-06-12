export type UndoPolyfill = () => void

/**
 *
 * @example
 * ```js
 * ```
 */
export function polyfill(): UndoPolyfill

export interface Errors {
  Error: Error
  ReferenceError: Error
  TypeError: Error
  SyntaxError: Error
  RangeError: Error
  URIError: Error
  EvalError: Error
  /**
   * `undefined` if the system does not support `AggregateError`
   */
  AggregateError?: Error
}

/**
 *
 * @example
 * ```js
 * ```
 */
export function getErrors(): Errors

/**
 *
 * @example
 * ```js
 * ```
 */
export function hasSupport(): boolean
