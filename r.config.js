/*global require*/
require.config({
    appDir: "tmp/modules/",
    baseUrl: "./",
    dir: "tmp/modules.amd",
    keepBuildDir: true,
    locale: "en-us",
    optimize: "none",
    skipDirOptimize: false,
    generateSourceMaps: true,
    normalizeDirDefines: "skip",
    optimizeCss: "none",
    inlineText: true,
    useStrict: false,
    pragmas: {
    },
    pragmasOnSave: {
    },
    skipPragmas: false,
    skipModuleInsertion: false,
    stubModules: [],
    optimizeAllPluginResources: false,
    findNestedDependencies: false,
    removeCombined: true,
    preserveLicenseComments: false,
    throwWhen: {
        optimize: true
    },
    waitSeconds: 7
});

