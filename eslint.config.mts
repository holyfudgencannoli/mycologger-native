import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginImport from "eslint-plugin-import";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    plugins: { js, import: pluginImport }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser },
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "import/no-cycle": ["error", { "maxDepth": 10 }]
    }
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
