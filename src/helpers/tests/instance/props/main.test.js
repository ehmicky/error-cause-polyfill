import { defineCauseTests } from './cause.test.js'
import { defineErrorsTests } from './errors.test.js'
import { defineMessageTests } from './message.test.js'
import { defineNameTests } from './name.test.js'
import { defineStackTests } from './stack.test.js'

// Tests run on the parent and child error instances, related to core error
// instance properties: name|message|stack|cause|errors
export const defineInstancePropsTests = ({
  title,
  error,
  PonyfillAnyError,
  OriginalAnyError,
  supportsCause,
  errors,
  message,
  cause,
  args,
}) => {
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
