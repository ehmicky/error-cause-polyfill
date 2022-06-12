import { OriginalErrors, polyfill } from 'error-cause-polyfill'

import { defineAllTests } from './helpers/main.js'

polyfill()
defineAllTests((name) => ({
  ErrorType: globalThis[name],
  OriginalAnyError: OriginalErrors[name],
}))
