import { defineAllTests } from '../helpers/tests/main.js'

// Run tests with the Error types without any polyfill nor ponyfill
defineAllTests((name) => ({
  PonyfillAnyError: globalThis[name],
  PonyfillBaseError: globalThis.Error,
  OriginalAnyError: globalThis[name],
  OriginalBaseError: globalThis.Error,
}))
