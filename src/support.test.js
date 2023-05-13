import test from 'ava'

import { hasSupport } from 'error-cause-polyfill'

test('hasSupport() returns whether error.cause is supported', (t) => {
  const error = new Error('test', { cause: 'cause' })
  t.is(error.cause === 'cause', hasSupport())
})
