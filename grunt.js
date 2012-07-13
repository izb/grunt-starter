/*jshint node: true */
/*global module:false*/
module.exports = function(grunt) {

    'use strict';

    var fs = require('fs');
    var path = require('path');
    var exec = require('child_process').exec;
    var tmp = 'tmp';

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

    /* 3rd party tasks */

    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-compass');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-handlebars');
    grunt.loadNpmTasks('grunt-closure-tools');

    /* Project config */

    grunt.initConfig({
        requirejs: {
            appDir: 'src/modules',
            dir: tmp,
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
                srcDir: tmp,
                src: (function(){ return modules.map(function(name) { return name+'.js'; }); }()),
                dest: 'public/js'
            },
            images: {
                srcDir: 'src/assets/images',
                src: ['**/*.jpg','**/*.jpeg','**/*.png','**/*.gif'],
                dest: 'public/images'
            },
            pages: {
                srcDir: 'src/assets',
                src: ['**/*.htm','**/*.html','**/*.php'],
                dest: 'public'
            }
        },
        concat: {
            main_helpers: {
                src: ['vendor/js/console-helper.min.js',tmp + '/main.js'],
                dest: 'public/js/main.js'
            }
        },
        handlebars: {
            all: {
                src: 'src/templates/**/*.handlebars',
                dest: 'public/js/templates/all.js'
            }
        },
        compass: {
            dev: {
                src: 'src/stylesheets',
                dest: 'tmp/css'
            },
            prod: {
                src: 'src/stylesheets',
                dest: 'tmp/css'
            }
        },
        csslint: {
            all: {
                    src: "tmp/**/*.css",
                    rules: {
                    }
            }
        },
        cssmin: {
            all: {
                    src: ["vendor/stylesheets/normalize.css", "tmp/**/*.css", "vendor/stylesheets/helpers.css"],
                    dest: 'public/css/all.css'
            }
        },
        closureCompiler: {
            dev: {
                closureCompiler: 'closure-compiler/compiler.jar',
                js: 'public/js/**/*.js',
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    create_source_map: 'public/js/weee.map',
                    source_map_format: 'V3',
                    externs: ['vendor/js/require.js'],
                    warning_level: 'quiet',
                    summary_detail_level: 3
                },
                output_file: 'public/js/weee.js'
            },
            prod: {
                closureCompiler: 'closure-compiler/compiler.jar',
                js: 'public/js/**/*.js'
            }
        },
        lint: {
            dev:  ['grunt.js', 'src/**/*.js', 'test/**/*.js'],
            prod: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
        },
        jshint: {
            dev:  (function() { return lintopts(true); }()), /* true for in-dev option */
            prod: (function() { return lintopts(false); }()) /* false for production (no console) */
        }
        // qunit: {
        //     files: ['test/**/*.html']
        // },
        // watch: {
        //     files: '<config:lint.files>',
        //     tasks: 'lint qunit'
        // },
    });

    /* Helper tasks */

    grunt.registerMultiTask('handlebars', 'Precompile Handlebars templates', function() {

        var done = this.async();
        var files = grunt.file.expandFiles(this.data.src).map(function(f) {return '"'+f+'"';}).join(" ");

        var destDir = path.dirname(this.data.dest);

        try {
            fs.mkdirSync(path.resolve(destDir));
        } catch(e) {
            /* Folder exists. Fine, ignore. */
        }

        var cmd = 'handlebars ' + files + ' -f ' + this.data.dest;
        console.log(cmd);
        exec(cmd, done);
    });

    grunt.registerMultiTask( "copy", "Copy files from one folder to another", function() {

        var srcDir = this.data.srcDir;
        var files = grunt.file.expandFiles(this.file.src.map(function(f) { return path.join(srcDir, f); }));
        var dest = this.file.dest;

        files.forEach(function(f) {
            grunt.file.copy(f, path.join(dest, f.substr(srcDir.length)));
        });

    });

    /* CLI tasks */

    grunt.registerTask('default', 'lint:dev requirejs copy:js handlebars:all concat:main_helpers compass:dev csslint cssmin copy:images copy:pages closureCompiler:dev');
    grunt.registerTask('production', 'lint:prod requirejs copy:js handlebars:all concat:main_helpers compass:prod csslint cssmin copy:images copy:pages closureCompiler:prod');
};
