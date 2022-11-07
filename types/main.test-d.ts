import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import {
  polyfill,
  UndoPolyfill,
  getErrors,
  Errors,
  hasSupport,
} from 'error-cause-polyfill'

const undoPolyfillFunc = polyfill()
expectError(polyfill(true))
expectType<UndoPolyfill>(undoPolyfillFunc)
expectAssignable<UndoPolyfill>(() => {})
expectNotAssignable<UndoPolyfill>((_: boolean) => {})
undoPolyfillFunc()
expectError(undoPolyfillFunc(true))

const errors = getErrors()
expectError(getErrors(true))
expectType<Errors>(errors)
expectType<Error>(errors.Error)
expectType<Error>(errors.TypeError)
expectType<Error | undefined>(errors.AggregateError)

expectType<boolean>(hasSupport())
expectError(hasSupport(true))
