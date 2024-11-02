/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    '../../.eslintrc.cjs',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@tanstack/query/recommended',
    'plugin:@tanstack/router/recommended',
  ],
  plugins: ['react', '@tanstack/query', '@tanstack/router', 'react-refresh'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
};
