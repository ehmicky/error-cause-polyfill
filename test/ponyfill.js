// eslint-disable-next-line import/no-namespace
import * as allExports from 'error-cause-polyfill'

import { defineTests } from './helpers/main.js'
import { ERROR_TYPES } from './helpers/types.js'

// eslint-disable-next-line fp/no-loops
for (const { name, args } of ERROR_TYPES) {
  defineTests({
    name,
    args,
    ErrorType: allExports[name],
    OriginalAnyError: allExports[`Original${name}`],
  })
}
