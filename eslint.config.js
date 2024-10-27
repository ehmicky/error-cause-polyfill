import eslintConfig from '@ehmicky/eslint-config'

export default [
  ...eslintConfig,
  {
    rules: {
      // This reports this module itself as an unnecessary polyfill
      'unicorn/no-unnecessary-polyfills': 0,
    },
  },
]
