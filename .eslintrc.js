const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  'parser': 'babel-eslint',

  'env': {
    'browser': true,
    'jest': true,
    'node': true,
    'es6': true,
  },

  'parserOptions': {
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
      'modules': true,
    },
  },

  'extends': 'eslint:recommended',

  'plugins': [
    'react',
  ],

  'globals': {
    'Promise': true,
    'chrome': true,
  },

  'rules': {
    'array-bracket-spacing': [ERROR, 'never'],
    'array-callback-return': ERROR,
    'brace-style': [ERROR, 'stroustrup', {'allowSingleLine': true}],
    'camelcase': [ERROR, {'properties': 'never'}],
    'comma-dangle': [ERROR, 'always-multiline'],
    'comma-spacing': [ERROR, {'before': false, 'after': true}],
    'dot-notation': ERROR,
    'eqeqeq': ERROR,
    'id-length': [OFF, {'min': 2, 'exceptions': ['i', 'j', 'k', 'x', 'y']}],
    'indent': [ERROR, ERROR, {'SwitchCase': WARNING}],
    'key-spacing': [ERROR, {'beforeColon': false, 'afterColon': true}],
    'keyword-spacing': [ERROR, {'before': true, 'after': true}],
    'max-len': [OFF, 80, 4, {'ignoreUrls': true, 'ignoreStrings': true}],
    'new-cap': [ERROR, {'newIsCap': true, 'capIsNew': true}],
    'newline-per-chained-call': [ERROR, {'ignoreChainWithDepth': 3}],
    'no-array-constructor': ERROR,
    'no-cond-assign': ERROR,
    'no-console': [OFF, {'allow': ['warn', 'error']}],
    'no-dupe-keys': ERROR,
    'no-dupe-args': ERROR,
    'no-fallthrough': ERROR,
    'no-implicit-coercion': ERROR,
    'no-loop-func': ERROR,
    'no-multiple-empty-lines': ERROR,
    'no-nested-ternary': ERROR,
    'no-new-func': ERROR,
    'no-new-object': ERROR,
    'no-param-reassign': ERROR,
    'no-shadow-restricted-names': ERROR,
    'no-trailing-spaces': ERROR,
    'no-undef': ERROR,
    'no-unreachable': ERROR,
    'no-unused-expressions': ERROR,
    'no-unused-vars': ERROR,
    'no-use-before-define': [ERROR, {'functions': false, 'classes': false}],
    'object-curly-spacing': [ERROR, 'never'],
    'one-var': [ERROR, 'never'],
    'operator-linebreak': [ERROR, 'after'],
    'padded-blocks': [ERROR, 'never'],
    'prefer-rest-params': ERROR,
    'quotes': [ERROR, 'single', 'avoid-escape'],
    'quote-props': [ERROR, 'as-needed'],
    'semi': ERROR,
    'space-before-blocks': [ERROR, 'always'],
    'space-before-function-paren': [
      ERROR, {'anonymous': 'always', 'named': 'never'}
    ],
    'spaced-comment': [ERROR, 'always'],
    'space-infix-ops': ERROR,
    'space-in-parens': [ERROR, 'never'],
    'space-unary-ops': [ERROR, {'words': true, 'nonwords': false}],
    'wrap-iife': [ERROR, 'inside'],

    // ES6
    'arrow-parens': [ERROR, 'always'],
    'arrow-spacing': [ERROR, {'before': true, 'after': true}],
    'constructor-super': ERROR,
    'no-case-declarations': ERROR,
    'no-confusing-arrow': [ERROR, {'allowParens': true}],
    'no-const-assign': ERROR,
    'no-dupe-class-members': ERROR,
    'no-duplicate-imports': ERROR,
    'no-var': ERROR,
    'no-useless-constructor': ERROR,
    'object-shorthand': [ERROR, 'methods'],
    'prefer-arrow-callback': ERROR,
    'prefer-const': [ERROR, {'destructuring': 'any'}],
    'prefer-spread': ERROR,
    'prefer-template': ERROR,
    
    // React
    'jsx-quotes': [ERROR, 'prefer-double'],
    'react/display-name': ERROR,
    'react/jsx-boolean-value': ERROR,
    'react/jsx-closing-bracket-location': ERROR,
    'react/jsx-curly-spacing': ERROR,
    'react/jsx-handler-names': [
      ERROR, {'eventHandlerPrefix': '_?handle', 'eventHandlerPropPrefix': 'on'}
    ],
    'react/jsx-indent-props': OFF,
    'react/jsx-indent': [ERROR, ERROR],
    'react/jsx-key': ERROR,
    'react/jsx-max-props-per-line': [ERROR, {'maximum': 4}],
    'react/jsx-no-duplicate-props': ERROR,
    'react/jsx-no-undef': ERROR,
    'react/sort-prop-types': ERROR,
    'react/jsx-uses-react': ERROR,
    'react/jsx-uses-vars': ERROR,
    'react/jsx-wrap-multilines': [
      ERROR, {'declaration': true, 'assignment': true, 'return': true}
    ],
    'react/no-danger': ERROR,
    'react/no-deprecated': ERROR,
    'react/no-did-update-set-state': ERROR,
    'react/no-direct-mutation-state': ERROR,
    'react/no-multi-comp': ERROR,
    'react/no-string-refs': ERROR,
    'react/no-unknown-property': ERROR,
    'react/prop-types': OFF,
    'react/self-closing-comp': ERROR,
    'react/sort-comp': ERROR,
  },
};