import { defineInstanceMiscTests } from './misc.js'
import { defineInstancePropsTests } from './props.js'
import { defineInstanceProtoTests } from './prototype.js'

// Tests run on the parent and child error instances
export const defineInstanceTests = function ({
  title,
  error,
  PonyfillAnyError,
  PonyfillBaseError,
  OriginalAnyError,
  OriginalBaseError,
  supportsCause,
  errors,
  message,
  cause,
}) {
  defineInstanceProtoTests({
    title,
    error,
    PonyfillAnyError,
    PonyfillBaseError,
    OriginalAnyError,
    OriginalBaseError,
  })

  defineInstancePropsTests({
    title,
    error,
    PonyfillAnyError,
    supportsCause,
    errors,
    message,
    cause,
  })

  defineInstanceMiscTests({ title, error, PonyfillAnyError })
}
