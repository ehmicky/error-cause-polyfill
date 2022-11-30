import { defineAllTests } from '../helpers/tests/main.test.js'

// Run tests with the Error classes without any polyfill nor ponyfill
defineAllTests(globalThis, false)
