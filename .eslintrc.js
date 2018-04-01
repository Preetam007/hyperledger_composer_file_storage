module.exports = {
  'env': {
    'browser': true,
    'meteor': true,
    'node': true,
    'es6': true
  },
  'extends': 'netflix',
  "rules": {
    "semi": [2, "always"],
    "prefer-const": 1,
    curly: [2, "all"],
    "no-use-before-define": ["error", { "functions": true, "classes": true }],
          "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  }
}
