module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: ['airbnb-base', 'prettier', 'plugin:security/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'prettier/prettier': ['error'],
        'no-use-before-define': 'off',
        'consistent-return': 'off',
        'func-names': 'off'
    },
    plugins: ['prettier', 'security']
};