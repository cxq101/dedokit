import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
    input: "./src/plugin/index.ts",
    output: {
        file: "./dist/rollupPlugin.js",
        format: "es"
    },
    plugins:[typescript()]
});