/**
 * ESLint Configuration for React + Vite Project
 *
 * This file defines a modern ESLint setup using the flat config format (ESLint 9+).
 * It ensures code quality and consistency for JavaScript and React-based applications.
 * The configuration includes:
 * - Base rules from ESLint
 * - React plugin for linting JSX and React-specific patterns
 * - React Hooks plugin for proper usage of hooks
 * - React Refresh plugin to ensure hot-reload boundaries are respected
 * - Support for browser globals and ECMAScript modules
 */

import js from '@eslint/js'; // Core ESLint rules
import globals from 'globals'; // Browser global variables
import react from 'eslint-plugin-react'; // React rules
import reactHooks from 'eslint-plugin-react-hooks'; // Enforce correct use of hooks
import reactRefresh from 'eslint-plugin-react-refresh'; // Linting for React Fast Refresh compatibility

export default [
  // Ignore the build output directory
  { ignores: ['dist'] },

  {
    // Apply rules to all JavaScript and JSX files
    files: ['**/*.{js,jsx}'],

    // Language options and parser settings
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },

    // React version autodetection
    settings: {
      react: { version: '18.3' },
    },

    // Plugins used for additional linting functionality
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    // Ruleset applied to enforce standards
    rules: {
      // Recommended base JavaScript rules
      ...js.configs.recommended.rules,

      // Recommended React and JSX rules
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,

      // Recommended rules for hooks
      ...reactHooks.configs.recommended.rules,

      // Disable target=_blank warning (customise as needed)
      'react/jsx-no-target-blank': 'off',

      // Ensure only component modules are exported with React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
