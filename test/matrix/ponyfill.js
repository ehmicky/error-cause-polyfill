import { getErrors } from 'error-cause-polyfill'

import { defineAllTests } from '../helpers/tests/main.js'

// Run tests with the Error classes with the ponyfills
defineAllTests(getErrors(), true)
