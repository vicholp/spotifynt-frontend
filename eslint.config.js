import js from "@eslint/js";

import pluginVue from 'eslint-plugin-vue';
import pluginTailwind from 'eslint-plugin-tailwindcss';
import vitest from 'eslint-plugin-vitest';
import pluginImport from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
  languageOptions: {
    // node: true,
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: {
      pluginVue,
      pluginTailwind,
      vitest,
      pluginImport,
  },
  "rules": {
    ...vitest.configs.recommended.rules,
    "comma-dangle": [
      1,
      "always-multiline",
    ],
    "comma-spacing": [
      1,
      {
        "before": false,
        "after": true,
      },
    ],
    "camelcase": [
      1,
      {
        "properties": "always",
      },
    ],
    "comma-style": [
      2,
      "last",
    ],
    "padded-blocks": [
      1,
      "never",
    ],
    "no-console": 1,
    "no-debugger": 2,
    "no-multi-spaces": 1,
    "no-use-before-define": 2,
    "semi": [
      1,
      "always",
    ],
    "semi-spacing": [
      1,
      {
        "before": false,
        "after": true,
      },
    ],
    "vue/max-len": [
      1,
      {
        "code": 120,
        "ignoreHTMLAttributeValues": true,
      },
    ],
    "vue/max-attributes-per-line": 2,
    "vue/script-indent": 1,
    "vue/multi-word-component-names": 0,
  },
  // "settings": {
  //   "import/resolver": {
  //     "node": {
  //       "extensions": [
  //         ".js",
  //         ".json",
  //       ],
  //     },
  //   },
  // },
  // "env": {
  //   "es2020": true,
  //   "browser": true,
  //   "node": true
  // },
}];
