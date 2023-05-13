import { polyfill } from 'error-cause-polyfill'

import { defineAllTests } from '../helpers/tests/main.test.js'

// Run tests with the Error classes after polyfill() then undoPolyfill()
const undoPolyfill = polyfill()
undoPolyfill()
defineAllTests(globalThis, false)
