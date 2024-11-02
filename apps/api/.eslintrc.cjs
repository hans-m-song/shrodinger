/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../.eslintrc.cjs', 'plugin:drizzle/recommended'],
  plugins: ['drizzle'],
  env: { node: true },
};
