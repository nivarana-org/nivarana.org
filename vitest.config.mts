import { loadEnv } from "vite";
import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    plugins: [react()],
    test: {
        environment: "jsdom",
        env: loadEnv("", process.cwd(), ""),
        exclude: [...configDefaults.exclude, "tests/**"],
    },
});
