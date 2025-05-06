module.exports = {
  env: {
    mocha: true,
  },
  extends: "standard-with-typescript",
  ignorePatterns: ["dist/*", "logs/*"],
  parserOptions: {
    ecmaVersion: 2020,
    project: "./tsconfig.test.json",
  },
  rules: {
    // keep your existing rules…
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    quotes: [
      "error",
      "double",
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    "@typescript-eslint/quotes": [
      "error",
      "double",
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    semi: ["error", "always"],
    "@typescript-eslint/semi": ["error", "always"],

    // ←––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // allow semicolons in interface/type members and no commas
    "@typescript-eslint/member-delimiter-style": "off",

    // allow trailing commas (objects, arrays, etc.)
    // ES5-style trailing commas: only in multiline objects & arrays
    "@typescript-eslint/comma-dangle": [
      "error",
      {
        // objects and arrays: require trailing comma if multiline
        objects: "always-multiline",
        arrays: "always-multiline",
        // modules/functions/etc: never allow
        imports: "never",
        exports: "never",
        functions: "never",
      },
    ],
    // allow no space before function parens
    "@typescript-eslint/space-before-function-paren": ["error", "never"],
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––→
  },
};
