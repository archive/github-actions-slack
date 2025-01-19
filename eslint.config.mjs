import prettier from "eslint-plugin-prettier";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended", "plugin:prettier/recommended"), {
    plugins: {
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            fetch: false,
            Promise: false,
            test: false,
            expect: false,
            jest: false,
            describe: false,
        },

        ecmaVersion: 9,
        sourceType: "commonjs",
    },

    rules: {
        "no-console": 0,
    },
}];