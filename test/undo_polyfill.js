import { OriginalErrors, polyfill, undoPolyfill } from 'error-cause-polyfill'

import { defineAllTests } from './helpers/main.js'

// Run tests with the Error types after polyfill() then undoPolyfill()
polyfill()
undoPolyfill()
defineAllTests((name) => ({
  ErrorType: globalThis[name],
  OriginalAnyError: OriginalErrors[name],
}))
