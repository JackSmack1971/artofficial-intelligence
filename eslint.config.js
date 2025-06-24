import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'

const compat = new FlatCompat({
  baseDirectory: new URL('.', import.meta.url).pathname,
})

export default [
  js.configs.recommended,
  ...compat.config({
    env: { browser: true, es2021: true, node: true },
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'plugin:security/recommended',
    ],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'security', 'security-node'],
    settings: {
      react: { version: '18.2' },
    },
    rules: {
      // Disallow eval() to mitigate code injection risks
      'no-eval': 'error',
      // Use crypto-secure random numbers instead of Math.random()
      'security-node/detect-insecure-randomness': 'error',
      // Prevent object injection vulnerabilities
      'security/detect-object-injection': 'error',
    },
  }),
]
