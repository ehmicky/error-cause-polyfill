import { defineAllTests } from '../helpers/tests/main.js'

// Run tests with the Error types without any polyfill nor ponyfill
/* jscpd:ignore-start */
defineAllTests(globalThis, false)
/* jscpd:ignore-end */
