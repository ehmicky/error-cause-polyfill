import { defineAllTests } from '../helpers/tests/main.js'

// Run tests with the Error types without any polyfill nor ponyfill
defineAllTests(globalThis, false)
