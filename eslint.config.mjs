import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['dist/', 'e2e/'] },
  js.configs.recommended,
  {
    // Classic scripts: the background (Chrome's service worker, Firefox's background page) and the options page
    files: ['data/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: { ...globals.browser, ...globals.serviceworker, ...globals.webextensions },
    },
  },
  { files: ['scripts/**/*.mjs', 'tests/**/*.mjs'], languageOptions: { globals: globals.node } },
]
