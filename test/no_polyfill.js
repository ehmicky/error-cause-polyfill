import { defineTests } from './helpers/main.js'
import { ERROR_TYPES } from './helpers/types.js'

// eslint-disable-next-line fp/no-loops
for (const { name, args } of ERROR_TYPES) {
  defineTests({
    name,
    args,
    ErrorType: globalThis[name],
    OriginalAnyError: globalThis[name],
  })
}
