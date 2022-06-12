import { originalErrors, polyfill, undoPolyfill } from 'error-cause-polyfill'

import { defineAllTests } from './helpers/main.js'

polyfill()
undoPolyfill()
defineAllTests((name) => ({
  ErrorType: globalThis[name],
  OriginalAnyError: originalErrors[name],
}))
