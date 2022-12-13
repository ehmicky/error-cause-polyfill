// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

// Tests run on the child error instances
export const defineChildInstanceTests = (
  title,
  {
    ChildError: { PonyfillAnyError: ChildError },
    GrandChildError: { error: grandChildError },
  },
) => {
  test(`Grand child error is instanceof child error | ${title}`, (t) => {
    t.true(grandChildError instanceof ChildError)
  })
}
