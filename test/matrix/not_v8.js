import { hasSupport } from 'error-cause-polyfill'

import { defineAllTests } from '../helpers/tests/main.js'

const supportsCause = hasSupport()

// eslint-disable-next-line fp/no-delete
delete Error.captureStackTrace

// Run tests with the Error types without any polyfill nor ponyfill.
// But mimicking running not in V8, since V8 has some specific behavior related
// to `Error`.
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
