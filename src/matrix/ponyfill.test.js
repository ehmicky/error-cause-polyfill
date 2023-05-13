import { defineAllTests } from '../helpers/tests/main.test.js'

import { getErrors } from 'error-cause-polyfill'

// Run tests with the Error classes with the ponyfills
defineAllTests(getErrors(), true)
