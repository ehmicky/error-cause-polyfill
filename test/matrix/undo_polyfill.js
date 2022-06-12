import { polyfill, hasSupport } from 'error-cause-polyfill'

import { defineAllTests } from '../helpers/tests/main.js'
import { getOriginalErrors } from '../helpers/types.js'

// Run tests with the Error types after polyfill() then undoPolyfill()
const supportsCause = hasSupport()
const OriginalErrors = getOriginalErrors()
const undoPolyfill = polyfill()
undoPolyfill()
defineAllTests(
  (name) => ({
    PonyfillAnyError: globalThis[name],
    OriginalAnyError: OriginalErrors[name],
  }),
  {
    PonyfillBaseError: globalThis.Error,
    OriginalBaseError: OriginalErrors.Error,
    supportsCause,
  },
)
