import {
  polyfill,
  type UndoPolyfill,
  getErrors,
  type Errors,
  hasSupport,
} from 'error-cause-polyfill'
import { expectType, expectAssignable, expectNotAssignable } from 'tsd'


const undoPolyfillFunc = polyfill()
// @ts-expect-error
polyfill(true)
expectType<UndoPolyfill>(undoPolyfillFunc)
expectAssignable<UndoPolyfill>(() => {})
expectNotAssignable<UndoPolyfill>((arg: boolean) => {})
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
