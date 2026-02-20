import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    {
        extends: [
            ...nextCoreWebVitals,
            ...nextTypescript,
            ...compat.extends("prettier"),
        ],
    },
    {
        settings: {
            // Fix for ESLint 10+: eslint-plugin-react uses context.getFilename() (legacy API)
            // which was removed in ESLint 10 flat config. Declaring the version explicitly
            // prevents the plugin from trying to auto-detect it and failing.
            react: { version: "19" },
        },
    },
]);
