/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    project: './tsconfig.eslint.json',
    parser: "@typescript-eslint/parser",
    ecmaVersion: 'latest'
  },
  rules:{
    "@typescript-eslint/strict-boolean-expressions": "error",
  }
}
