// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

// Tests run on the parent and child error instances, related to `error.cause`
export const defineCauseTests = ({
  title,
  error,
  PonyfillAnyError,
  supportsCause,
  cause,
  args,
}) => {
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

  test(`error.cause can be a function | ${title}`, (t) => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const func = () => {}
    // eslint-disable-next-line fp/no-mutation
    func.cause = cause
    const argsA = [...args.slice(0, -1), func]
    const errorA = new PonyfillAnyError(...argsA)
    t.is(errorA.cause === cause, supportsCause)
  })
}
