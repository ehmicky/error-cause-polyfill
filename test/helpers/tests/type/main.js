import { defineAnyTypeTests } from './any.js'
import { defineBaseTypeTests } from './base.js'
import { defineMiscTypeTests } from './misc.js'

// Tests run only on the parent Type
export const defineTypeTests = function ({
  title,
  PonyfillAnyError,
  OriginalAnyError,
  args,
}) {
  defineAnyTypeTests({ title, PonyfillAnyError, OriginalAnyError })

  if (PonyfillAnyError.name === 'Error') {
    defineBaseTypeTests({ title, PonyfillAnyError, OriginalAnyError, args })
  } else {
    defineMiscTypeTests({ title, PonyfillAnyError, OriginalAnyError, args })
  }
}
