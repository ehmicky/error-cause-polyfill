import { getErrors } from 'error-cause-polyfill'

import { defineAllTests } from '../helpers/tests/main.js'

// Run tests with the Error types with the ponyfills
const PonyfillErrors = getErrors()
defineAllTests(
  (name) => ({
    PonyfillAnyError: PonyfillErrors[name],
    OriginalAnyError: globalThis[name],
  }),
  {
    PonyfillBaseError: PonyfillErrors.Error,
    OriginalBaseError: globalThis.Error,
    supportsCause: true,
  },
)
