import { defineAllTests } from '../helpers/tests/main.test.js'

import { polyfill } from 'error-cause-polyfill'

// Run tests with the Error classes after polyfill()
// We use different test files which import a common test helper because:
//  - `polyfill()` changes the global variable, i.e. must be in a separate
//    process
//  - With Ava, this requires different test files
//  - Ava requires shared test logic (including tests themselves) to be in
//    helpers
polyfill()
defineAllTests(globalThis, true)
