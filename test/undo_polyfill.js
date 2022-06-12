import { polyfill } from 'error-cause-polyfill'

import { defineAllTests } from './helpers/main.js'
import { getOriginalErrors } from './helpers/types.js'

// Run tests with the Error types after polyfill() then undoPolyfill()
const OriginalErrors = getOriginalErrors()
const undoPolyfill = polyfill()
undoPolyfill()
defineAllTests((name) => ({
  PonyfillAnyError: globalThis[name],
  PonyfillBaseError: globalThis.Error,
  OriginalAnyError: OriginalErrors[name],
  OriginalBaseError: OriginalErrors.Error,
}))
