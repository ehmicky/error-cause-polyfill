import { Errors } from 'error-cause-polyfill'

import { defineAllTests } from './helpers/main.js'

// Run tests with the Error types with the ponyfills
defineAllTests((name) => ({
  ErrorType: Errors[name],
  OriginalAnyError: globalThis[name],
}))
