const expo = require('eslint-config-expo/flat');
const prettier = require('eslint-plugin-prettier/recommended');

module.exports = [
  ...expo,
  prettier,
  {
    ignores: ['.expo/*', 'android/*', 'ios/*', 'node_modules/*', 'dist/*', 'web-build/*'],
  },
  {
    settings: {
      'import/resolver': {
        'babel-module': {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      },
    },
    rules: {
      'prettier/prettier': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
