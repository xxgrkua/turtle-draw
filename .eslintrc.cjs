module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/jsx-runtime",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  overrides: [
    {
      files: ["src/server/**/*.js", "scripts/**/*.js"],
      env: { node: true, es2020: true },
    },
    {
      files: ["src/server/**/*.ts", "scripts/**/*.ts"],
      env: { node: true, es2020: true },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/strict-type-checked",
      ],
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    {
      files: ["src/client/**/*.ts", "src/client/**/*.tsx"],
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
        project: ["./tsconfig.json", "./tsconfig.node.json"],
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
    // "react/react-in-jsx-scope": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
