import { defineAnyClassTests } from './any.test.js'
import { defineBaseClassTests } from './base.test.js'
import { defineMiscClassTests } from './misc.test.js'

// Tests run only on the parent class
export const defineClassTests = ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) => {
  defineAnyClassTests({ title, PonyfillAnyError, OriginalAnyError })

  if (PonyfillAnyError.name === 'Error') {
    defineBaseClassTests({ title, PonyfillAnyError, OriginalAnyError, args })
  } else {
    defineMiscClassTests({ title, PonyfillAnyError, OriginalAnyError, args })
  }
}
