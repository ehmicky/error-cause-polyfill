import { polyfill } from 'error-cause-polyfill'

import { defineAllTests } from './helpers/main.js'
import { getOriginalErrors } from './helpers/types.js'

// Run tests with the Error types after polyfill()
// We use different test files which import a common test helper because:
//  - `polyfill()` changes the global variable, i.e. must be in a separate
//    process
//  - With Ava, this requires different test files
//  - Ava requires shared test logic (including tests themselves) to be in
//    helpers
const OriginalErrors = getOriginalErrors()
polyfill()
defineAllTests((name) => ({
  ErrorType: globalThis[name],
  OriginalAnyError: OriginalErrors[name],
}))
