import { defineAllTests } from '../helpers/tests/main.test.js'

import { getErrors } from 'error-cause-polyfill'

// Mimics running not in V8, since V8 has some specific behavior related
// to `Error`.
// eslint-disable-next-line fp/no-delete
delete Error.captureStackTrace
defineAllTests(getErrors(), true)
