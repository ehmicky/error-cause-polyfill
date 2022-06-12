import { polyfill } from 'error-cause-polyfill'

import { defineAllTests } from '../helpers/tests/main.js'

// Run tests with the Error types after polyfill() then undoPolyfill()
const undoPolyfill = polyfill()
undoPolyfill()
defineAllTests(globalThis, false)
