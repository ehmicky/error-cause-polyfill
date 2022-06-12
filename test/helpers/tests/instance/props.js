// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'

import { defineAggInstanceTests } from './aggregate.js'

const { hasOwnProperty: hasOwn } = Object.prototype

// Tests run on the parent and child error instances, related to core error
// instance properties: name|message|stack|cause|errors
export const defineInstancePropsTests = function ({
  title,
  error,
  PonyfillAnyError,
  supportsCause,
  errors,
  message,
  cause,
}) {
  test(`error.name is correct | ${title}`, (t) => {
    t.is(error.name, PonyfillAnyError.name)
  })

  test(`error.name is inherited | ${title}`, (t) => {
    t.false(hasOwn.call(error, 'name'))
    t.true(hasOwn.call(Object.getPrototypeOf(error), 'name'))
  })

  test(`error.name has right descriptors | ${title}`, (t) => {
    t.deepEqual(
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(error), 'name'),
      {
        value: error.name,
        writable: true,
        enumerable: false,
        configurable: true,
      },
    )
  })

  test(`error.message is correct | ${title}`, (t) => {
    t.is(error.message, message)
  })

  test(`error.message has right descriptors | ${title}`, (t) => {
    t.deepEqual(Object.getOwnPropertyDescriptor(error, 'message'), {
      value: error.message,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })

  test(`error.stack is correct | ${title}`, (t) => {
    t.true(error.stack.includes(error.toString()))
    t.true(error.stack.includes('at '))
    t.true(error.stack.includes('helpers/'))
  })

  test(`error.stack has right descriptors | ${title}`, (t) => {
    t.deepEqual(Object.getOwnPropertyDescriptor(error, 'stack'), {
      value: error.stack,
      writable: true,
      enumerable: false,
      configurable: true,
    })
  })

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

  if (PonyfillAnyError.name === 'AggregateError') {
    defineAggInstanceTests(title, error, errors)
  }
}
