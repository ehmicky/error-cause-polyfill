import { defineAllTests } from '../helpers/tests/main.test.js'

// Run tests with the Error classes after "auto"
// eslint-disable-next-line import/no-unassigned-import, import/extensions
import 'error-cause-polyfill/auto'

defineAllTests(globalThis, true)
