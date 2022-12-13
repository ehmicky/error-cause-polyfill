import { defineChildInstanceTests } from './child.test.js'
import { getInstanceKinds } from './kinds.test.js'
import { defineInstanceMiscTests } from './misc.test.js'
import { defineInstancePropsTests } from './props/main.test.js'
import { defineInstanceProtoTests } from './prototype.test.js'

// Tests run on the parent and child error instances
export const defineInstancesTests = ({
  name,
  PonyfillAnyError,
  PonyfillBaseError,
  OriginalAnyError,
  OriginalBaseError,
  supportsCause,
  errors,
  message,
  cause,
  args,
}) => {
  const instanceKinds = getInstanceKinds(PonyfillAnyError, args)
  Object.entries(instanceKinds).forEach(
    ([title, { PonyfillAnyError: PonyfillAnyErrorA, error }]) => {
      defineInstanceTests({
        title: `${name} | ${title}`,
        error,
        PonyfillAnyError: PonyfillAnyErrorA,
        PonyfillBaseError,
        OriginalAnyError,
        OriginalBaseError,
        supportsCause,
        errors,
        message,
        cause,
        args,
      })
    },
  )
  defineChildInstanceTests(name, instanceKinds)
}

const defineInstanceTests = ({
  title,
  error,
  PonyfillAnyError,
  PonyfillBaseError,
  OriginalAnyError,
  OriginalBaseError,
  supportsCause,
  errors,
  message,
  cause,
  args,
}) => {
  defineInstanceProtoTests({
    title,
    error,
    PonyfillAnyError,
    PonyfillBaseError,
    OriginalAnyError,
    OriginalBaseError,
  })

  defineInstancePropsTests({
    title,
    error,
    PonyfillAnyError,
    OriginalAnyError,
    supportsCause,
    errors,
    message,
    cause,
    args,
  })

  defineInstanceMiscTests({ title, error, PonyfillAnyError })
}
