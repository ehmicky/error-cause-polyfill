import { defineAllTests } from '../helpers/tests/main.js'

// Run tests with the Error classes without any polyfill nor ponyfill
defineAllTests(globalThis, false)
