import { defineChildInstanceTests } from './child.js'
import { getInstanceKinds } from './kinds.js'
import { defineInstanceMiscTests } from './misc.js'
import { defineInstancePropsTests } from './props.js'
import { defineInstanceProtoTests } from './prototype.js'

// Tests run on the parent and child error instances
export const defineInstancesTests = function ({
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
}) {
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
      })
    },
  )
  defineChildInstanceTests(name, instanceKinds)
}

const defineInstanceTests = function ({
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
}) {
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
  })

  defineInstanceMiscTests({ title, error, PonyfillAnyError })
}
