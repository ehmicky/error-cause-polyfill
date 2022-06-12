import { Errors, OriginalErrors } from 'error-cause-polyfill'

import { defineAllTests } from './helpers/main.js'

defineAllTests((name) => ({
  ErrorType: Errors[name],
  OriginalAnyError: OriginalErrors[name],
}))
