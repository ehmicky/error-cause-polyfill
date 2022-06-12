import test from 'ava'
import { test as check } from 'error-cause-polyfill'

test('test() returns whether error.cause is supported', (t) => {
  const error = new Error('test', { cause: 'cause' })
  t.is(error.cause === 'cause', check())
})
