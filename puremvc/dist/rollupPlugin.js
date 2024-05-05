function rollupPlugin() {
    return {
        name: "rollupPlugin",
        resolveId: function (source, importer, options) {
            console.log("rollupPlugin--------", source, importer, options);
        },
    };
}

export { rollupPlugin };
