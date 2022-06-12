import { hasSupport } from 'error-cause-polyfill'

import { defineAllTests } from '../helpers/tests/main.js'

const supportsCause = hasSupport()

// Run tests with the Error types without any polyfill nor ponyfill
/* jscpd:ignore-start */
defineAllTests(
  (name) => ({
    PonyfillAnyError: globalThis[name],
    OriginalAnyError: globalThis[name],
  }),
  {
    PonyfillBaseError: globalThis.Error,
    OriginalBaseError: globalThis.Error,
    supportsCause,
  },
)
/* jscpd:ignore-end */
