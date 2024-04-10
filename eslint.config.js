import styleGuide from "eslint-config-standard";
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
  ...[].concat(styleGuide),
  {
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
    },
  },
]
tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended);