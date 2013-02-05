module.exports = function closureopts(isdev, sources, output, mapfile) {

    'use strict';

    var closureJar = 'bin/closure-compiler/compiler.jar';

    var opts = {
        closureCompiler: closureJar,
        js: sources,
        options: {
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            externs: ['vendor/js/require.js'],
            warning_level: 'quiet',
            summary_detail_level: 3
        },
        output_file: output,
        checkModified:true
    };

    if (isdev) {
        opts.options.compilation_level = 'WHITESPACE_ONLY';
    }

    if (mapfile) {
        opts.options.create_source_map = mapfile;
        opts.options.source_map_format = 'V3';
    }

    return opts;
};
