import { defineCauseTests } from './cause.js'
import { defineErrorsTests } from './errors.js'
import { defineMessageTests } from './message.js'
import { defineNameTests } from './name.js'
import { defineStackTests } from './stack.js'

// Tests run on the parent and child error instances, related to core error
// instance properties: name|message|stack|cause|errors
export const defineInstancePropsTests = function ({
  title,
  error,
  PonyfillAnyError,
  OriginalAnyError,
  supportsCause,
  errors,
  message,
  cause,
  args,
}) {
  defineNameTests(title, error, PonyfillAnyError)
  defineMessageTests(title, error, message)
  defineStackTests(title, error, OriginalAnyError)
  defineCauseTests({
    title,
    error,
    PonyfillAnyError,
    supportsCause,
    cause,
    args,
  })
  defineErrorsTests({ title, error, errors, PonyfillAnyError })
}
