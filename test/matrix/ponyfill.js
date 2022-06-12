import { getErrors } from 'error-cause-polyfill'

import { defineAllTests } from '../helpers/tests/main.js'

// Run tests with the Error types with the ponyfills
defineAllTests(getErrors(), true)
