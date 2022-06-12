import { polyfill, hasSupport } from 'error-cause-polyfill'

import { defineAllTests } from '../helpers/tests/main.js'

// Run tests with the Error types after polyfill() then undoPolyfill()
const supportsCause = hasSupport()
const undoPolyfill = polyfill()
undoPolyfill()
defineAllTests(
  (name) => ({
    PonyfillAnyError: globalThis[name],
  }),
  {
    PonyfillBaseError: globalThis.Error,
    supportsCause,
  },
)
