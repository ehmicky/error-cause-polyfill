// eslint-disable-next-line import/no-namespace
import * as allExports from 'error-cause-polyfill'
import { polyfill } from 'error-cause-polyfill'

import { defineAllTests } from './helpers/main.js'

polyfill()
defineAllTests((name) => ({
  ErrorType: globalThis[name],
  OriginalAnyError: allExports[`Original${name}`],
}))
