import { defineAnyClassTests } from './any.js'
import { defineBaseClassTests } from './base.js'
import { defineMiscClassTests } from './misc.js'

// Tests run only on the parent class
export const defineClassTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) {
  defineAnyClassTests({ title, PonyfillAnyError, OriginalAnyError })

  if (PonyfillAnyError.name === 'Error') {
    defineBaseClassTests({ title, PonyfillAnyError, OriginalAnyError, args })
  } else {
    defineMiscClassTests({ title, PonyfillAnyError, OriginalAnyError, args })
  }
}
