const nextConfig = require("eslint-config-next");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  ...nextConfig,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],

      // Core formatting rules
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "comma-dangle": ["error", "always-multiline"], // Common setting
      "arrow-spacing": ["error", { before: true, after: true }],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": ["error"],
      "space-unary-ops": ["error", { nonwords: false, words: true }],
    },
  },
  {
    ignores: ["node_modules/", ".next/", "out/", "build/", "next-env.d.ts"],
  },
  eslintConfigPrettier,
];
