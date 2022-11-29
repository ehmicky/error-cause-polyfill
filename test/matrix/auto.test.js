import { defineAllTests } from '../helpers/tests/main.js'

// Run tests with the Error classes after "auto"
// eslint-disable-next-line import/order, import/no-unassigned-import
import 'error-cause-polyfill/auto'

defineAllTests(globalThis, true)
