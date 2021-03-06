module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["plugin:@typescript-eslint/recommended", "airbnb-base", "plugin:prettier/recommended", "prettier/prettier"],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",

    "import/prefer-default-export": "off",
    "no-useless-constructor": "off",
    "import/no-unresolved": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "no-empty-function": ["error", { allow: ["constructors"] }],
    "max-classes-per-file": "off",
    "global-require": "off",
    "no-plusplus": "off",
    "no-restricted-syntax": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
  },
};
