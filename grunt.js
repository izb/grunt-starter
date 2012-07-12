/*jshint node: true */
/*global module:false*/
module.exports = function(grunt) {

    'use strict';

    var path = require('path');

    function lintopts(isdev) {
        return {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true, /* Allow 'document' et al */
                devel: isdev
            },
            globals: {
                jQuery: true,
                require: true,
                requirejs: true,
                define: true
            }
        };
    }

    var modules = ['main', 'submod2/main'];

    grunt.loadNpmTasks('grunt-requirejs');

    /* Project config */

    grunt.initConfig({
        requirejs: {
            appDir: 'src/modules',
            dir: 'requirejs-build',
            baseUrl: '.',
            paths: {
                underscore: 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.3.3/underscore-min.js',
                jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'
            },
            pragmas: {
                doExclude: true
            },
            optimize: 'none',
            skipModuleInsertion: false,
            optimizeAllPluginResources: true,
            findNestedDependencies: true,
            modules: (function(){ return modules.map(function(name) { return {name:name}; }); }())
        },
        copy: {
            js: {
                srcDir: 'requirejs-build',
                src: (function(){ return modules.map(function(name) { return name+'.js'; }); }()),
                dest: 'public/js'
            }
        },
        // concat: {
        //     dist: {
        //         src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        //         dest: 'dist/<%= pkg.name %>.js'
        //     }
        // },
        // min: {
        //     dist: {
        //         src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        //         dest: 'dist/<%= pkg.name %>.min.js'
        //     }
        // },
        // qunit: {
        //     files: ['test/**/*.html']
        // },
        lint: {
            dev:  ['grunt.js', 'src/**/*.js', 'test/**/*.js'],
            prod: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
        },
        // watch: {
        //     files: '<config:lint.files>',
        //     tasks: 'lint qunit'
        // },
        jshint: {
            dev:  (function() { return lintopts(true); }()), /* true for in-dev option */
            prod: (function() { return lintopts(false); }()) /* false for production (no console) */
        }
    });

    /* Helper tasks */

    grunt.registerMultiTask( "copy", "Copy files from one folder to another", function() {

        var srcDir = this.data.srcDir;
        var files = grunt.file.expandFiles(this.file.src.map(function(f) { return path.join(srcDir, f); }));
        var dest = this.file.dest;

        files.forEach(function(f) {
            grunt.file.copy(f, path.join(dest, f.substr(srcDir.length)));
        });

    });

    /* CLI tasks */

    grunt.registerTask('default', 'lint:dev requirejs copy:js');
    grunt.registerTask('production', 'lint:prod requirejs copy:js');
};
