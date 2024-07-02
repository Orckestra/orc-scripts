import globals from "globals";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import pluginReactHookConfig from "eslint-plugin-react-hooks"

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { files: ["**/*.js"], languageOptions: { sourceType: "module" } },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginReactConfig,
  {
    plugins: {
      "react-hooks": pluginReactHookConfig,
    },
    rules: pluginReactHookConfig.configs.recommended.rules,
  },
  {
    files: ["**/*.test.js"],
    rules: {
      "react/jsx-key": "off",
    }
  },
  {
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    languageOptions: {
      globals: {
        SUPPORTED_LOCALES: false,
        OVERTURE_APPLICATION: false,
        DEPENDENCIES: false,
        BUILD_ID: false,
        BUILD_NUMBER: false,
      },
    },
    rules: {
      "jsx-a11y/href-no-hash": "off",
      "react/prop-types": "off",
      "react/no-children-prop": "off",
      "react/display-name": "off",
    }
  }
];