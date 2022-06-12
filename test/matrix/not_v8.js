import { defineAllTests } from '../helpers/tests/main.js'

// Run tests with the Error types without any polyfill nor ponyfill.
// But mimicking running not in V8, since V8 has some specific behavior related
// to `Error`.
// eslint-disable-next-line fp/no-delete
delete Error.captureStackTrace
defineAllTests(globalThis, false)
