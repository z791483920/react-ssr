module.exports = {
  root: true,
  extends: 'airbnb',
  env: {
    es6: true,
    browser: true,
    node: true
  },
  parser: 'babel-eslint',
  plugins: ['babel', 'react'],
  parserOptions: {
    ecmaVersion: 7,
    ecmaFeatures: {
      experimentalDecorators: true
    }
  },
  settings: {},
  rules: {
    'class-methods-use-this': 'off',
    'comma-dangle': ['error', 'never'],
    'linebreak-style': 'off',
    'import/no-extraneous-dependencies': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'no-lonely-if': 'warn',
    'no-param-reassign': 'off',
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true
      }
    ],
    'no-undef': 'off',
    'no-underscore-dangle': 'warn',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true
      }
    ],
    'object-curly-newline': [
      'warn',
      {
        ObjectPattern: {
          consistent: true
        }
      }
    ],
    'object-curly-spacing': ['error', 'always'],
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-wrap-multilines': 'on',
    'react/jsx-wrap-multilines': 'off',
    'react/no-array-index-key': 'off',
    'react/no-did-mount-set-state': 'off',
    'react/no-multi-comp': 'off',
    'react/prefer-stateless-function': 'warn',
    'react/prop-types': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-access-state-in-setstate': 'off',
    'import/no-unresolved': 'off',
    camelcase: 'off',
    'no-unreachable': 'off',
    'consistent-return': 'off',
    'no-return-assign': 'off',
    indent: ['warn', 4],
    'react/jsx-indent': ['off', 4],
    'react/jsx-indent-props': ['off', 4],
    'array-callback-return': 'off',
    'no-nested-ternary': 'off'
  }
};
