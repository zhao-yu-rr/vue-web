import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default [
  // 基础推荐配置
  js.configs.recommended,

  // Vue 推荐配置
  ...pluginVue.configs['flat/recommended'],

  // Prettier 推荐配置（放在最后以覆盖 ESLint 格式化规则）
  prettierRecommended,

  // 全局配置
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
  },

  // 自定义规则
  {
    rules: {
      // Vue 规则
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',

      // Prettier 规则（以 ESLint 错误形式提示格式问题）
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: false,
          trailingComma: 'es5',
          tabWidth: 2,
          printWidth: 100,
          endOfLine: 'auto',
        },
      ],

      // 通用规则
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]
