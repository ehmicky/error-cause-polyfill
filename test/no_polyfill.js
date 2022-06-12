import { defineAllTests } from './helpers/main.js'

// Run tests with the Error types without any polyfill nor ponyfill
defineAllTests((name) => ({
  ErrorType: globalThis[name],
  OriginalAnyError: globalThis[name],
}))
