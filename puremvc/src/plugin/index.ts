import { Plugin } from "rollup";

export function rollupPlugin(): Plugin {
    return {
        name: "rollupPlugin",
        resolveId(source: string, importer: string, options: {}) {
            console.log("rollupPlugin--------", source, importer, options);
        },
    }
}