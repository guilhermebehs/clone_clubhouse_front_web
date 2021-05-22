module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'import/prefer-default-export': 0,
    'max-classes-per-file': 0,
    'no-underscore-dangle': 0,
    'class-methods-use-this': 0,
    'import/extensions': 0,
    'no-restricted-syntax': 0,
    'no-undef': 0,
    'no-shadow': 0,
  },
};
