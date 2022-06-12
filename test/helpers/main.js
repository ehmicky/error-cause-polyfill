// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

export const defineTests = function ({
  name,
  args,
  ErrorType,
  OriginalAnyError,
}) {
  const message = 'test'
  const error = new ErrorType(...args, message)

  test(`Is instance of original Error | ${name}`, (t) => {
    t.true(error instanceof OriginalAnyError)
  })
}
