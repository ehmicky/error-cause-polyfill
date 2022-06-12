import { polyfill, undoPolyfill } from 'error-cause-polyfill'

import { defineAllTests } from './helpers/main.js'
import { getOriginalErrors } from './helpers/types.js'

// Run tests with the Error types after polyfill() then undoPolyfill()
const OriginalErrors = getOriginalErrors()
polyfill()
undoPolyfill()
defineAllTests((name) => ({
  ErrorType: globalThis[name],
  OriginalAnyError: OriginalErrors[name],
}))
