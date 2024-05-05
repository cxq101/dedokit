import { defineConfig } from "rollup";
import { rollupPlugin } from "puremvc";

export default defineConfig({
    input: "./index.js",
    output: {
        file: "./dist/index.js",
        format: "es"
    },
    plugins: [rollupPlugin()]
})