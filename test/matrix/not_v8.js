import { defineAllTests } from '../helpers/tests/main.js'

// eslint-disable-next-line fp/no-delete
delete Error.captureStackTrace

// Run tests with the Error types without any polyfill nor ponyfill.
// But mimicking running not in V8, since V8 has some specific behavior related
// to `Error`.
defineAllTests(globalThis, false)
