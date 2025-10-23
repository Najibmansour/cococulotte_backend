import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: { globals: { node: true } },
    rules: { "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }] }
  }
];
