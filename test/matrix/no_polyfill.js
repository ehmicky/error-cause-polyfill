import { hasSupport } from 'error-cause-polyfill'

import { defineAllTests } from '../helpers/tests/main.js'

const supportsCause = hasSupport()

// Run tests with the Error types without any polyfill nor ponyfill
defineAllTests((name) => ({
  PonyfillAnyError: globalThis[name],
  PonyfillBaseError: globalThis.Error,
  OriginalAnyError: globalThis[name],
  OriginalBaseError: globalThis.Error,
  supportsCause,
}))
