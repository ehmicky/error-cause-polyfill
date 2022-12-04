import { expectType, expectAssignable, expectNotAssignable } from 'tsd'

import {
  polyfill,
  UndoPolyfill,
  getErrors,
  Errors,
  hasSupport,
} from 'error-cause-polyfill'

const undoPolyfillFunc = polyfill()
// @ts-expect-error
polyfill(true)
expectType<UndoPolyfill>(undoPolyfillFunc)
expectAssignable<UndoPolyfill>(() => {})
expectNotAssignable<UndoPolyfill>((_: boolean) => {})
undoPolyfillFunc()
// @ts-expect-error
undoPolyfillFunc(true)

const errors = getErrors()
// @ts-expect-error
getErrors(true)
expectType<Errors>(errors)
expectType<Error>(errors.Error)
expectType<Error>(errors.TypeError)
expectType<Error | undefined>(errors.AggregateError)

expectType<boolean>(hasSupport())
// @ts-expect-error
hasSupport(true)
