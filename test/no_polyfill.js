import { defineAllTests } from './helpers/main.js'

defineAllTests((name) => ({
  ErrorType: globalThis[name],
  OriginalAnyError: globalThis[name],
}))
