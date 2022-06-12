// eslint-disable-next-line import/no-namespace
import * as allExports from 'error-cause-polyfill'

import { defineAllTests } from './helpers/main.js'

defineAllTests((name) => ({
  ErrorType: allExports[name],
  OriginalAnyError: allExports[`Original${name}`],
}))
