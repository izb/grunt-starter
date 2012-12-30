/*global require:true,console:true*/
module.exports = function(grunt) {

    var path = require('path');
    var shouldBuild = require('./lib/shouldBuild');

    function deepCopy(obj) {
        var i;
        var out;

        if (Object.prototype.toString.call(obj) === '[object Array]') {
            out = [];
            var len = obj.length;
            for (i=0 ; i < len; i++ ) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        if (typeof obj === 'object') {
            out = {};
            for ( i in obj ) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        return obj;
    }
    /** Like closureCompiler, but minifies source files individually without concat (require.js has already concatted enough) */
    grunt.registerMultiTask('multiCompile', 'Call a grunt task on a group of source files one at a time individually', function() {

        'use strict';

        var data = this.data;
        var files = grunt.file.expandFiles(data.src);
        var opts = deepCopy(data.opts);
        var outdir = opts.output_file;
        var leading = data.srcDir.length;
        var done = this.async();

        var compile = function(f, files, maps) {
            opts.js = f.replace(/\\/g, '/');
            opts.output_file = path.join(outdir, f.substr(leading)).replace(/\\/g, '/');
            opts.output_file = grunt.template.process(opts.output_file);
            grunt.file.mkdir(path.dirname(opts.output_file));
            opts.checkModified = true;

            if(!shouldBuild(grunt, opts.output_file, [opts.js])) {
                if(files.length===0) {
                    done();
                    return;
                }
                compile(files[0], files.slice(1), maps===undefined?maps:maps.slice(1));
                return;
            }

            if (maps !== undefined) {
                opts.options.create_source_map = grunt.template.process(maps[0]);
                opts.options.source_map_format = 'V3';
            }

            if (files.length>0) {
                grunt.helper('closureCompiler', opts, function() {
                    compile(files[0], files.slice(1), maps===undefined?maps:maps.slice(1));
                });
            } else {
                grunt.helper('closureCompiler', opts, done);
            }
        };

        if(files.length > 0) {
            compile(files[0], files.slice(1), this.data.maps);
        } else {
            done();
        }
    });

};
