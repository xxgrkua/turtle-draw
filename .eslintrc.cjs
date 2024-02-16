module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/jsx-runtime",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "rust/*"],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  overrides: [
    {
      files: ["./server/**/*.ts", "./config/**/*.ts"],
      env: { node: true, es2020: true },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/strict-type-checked",
      ],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./server/tsconfig.json", "./tsconfig.config.json"],
      },
      rules: {
        "no-unsafe-member-access": "off",
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
        // this is fixed in express 5, but not 4
        "@typescript-eslint/no-misused-promises": "off",
      },
    },
    {
      files: ["./client/**/*.tsx", "./client/**/*.ts"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:react/jsx-runtime",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
      ],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./client/tsconfig.json", "./tsconfig.node.json"],
        tsconfigRootDir: __dirname,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-explicit-any": ["off"],
    // "react/react-in-jsx-scope": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
