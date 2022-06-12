// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

// Tests run on the parent and child error instances, related to `error.cause`
export const defineCauseTests = function ({
  title,
  error,
  supportsCause,
  cause,
}) {
  test(`error.cause is patched | ${title}`, (t) => {
    t.is(error.cause === cause, supportsCause)
  })

  test(`error.cause has right descriptors | ${title}`, (t) => {
    t.deepEqual(
      Object.getOwnPropertyDescriptor(error, 'cause'),
      supportsCause
        ? {
            value: error.cause,
            writable: true,
            enumerable: false,
            configurable: true,
          }
        : undefined,
    )
  })
}
