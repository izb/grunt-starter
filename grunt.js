/*jshint node: true */
/*global module:false */
module.exports = function(grunt) {

    'use strict';

    var fs = require('fs');
    var path = require('path');
    var exec = require('child_process').exec;
    var tmp = 'tmp';

    /* Custom options */

    var closureJar = 'bin/closure-compiler/compiler.jar';

    /* Input file options */

    /* The main module is first. */
    var modules = ['main', 'submod2/main'];

    /* Option generator functions */

    function closureopts(sources, output, mapfile) {

        var opts = {
            closureCompiler: closureJar,
            js: sources,
            options: {
                compilation_level: 'ADVANCED_OPTIMIZATIONS',
                externs: ['vendor/js/require.js'],
                warning_level: 'quiet',
                summary_detail_level: 3
            },
            output_file: output
        };

        if (mapfile) {
            opts.options.create_source_map = mapfile;
            opts.options.source_map_format = 'V3';
        }

        return opts;
    }

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

    /* 3rd party tasks */

    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-clean');
    grunt.loadNpmTasks('grunt-compass');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-handlebars');
    grunt.loadNpmTasks('grunt-closure-tools');

    /* Helper functions */

    /** Returns true if a given output file (out) is older than any of its array of
      * dependencies (ins) */
    function shouldBuild(out, ins) {
        if (path.existsSync(out)) {
            var out_mtime =fs.lstatSync(out).mtime;
            for(var i = 0; i < ins.length; i++) {
                var f = ins[i];
                if (fs.lstatSync(f).mtime > out_mtime) {
                    return true;
                }
            }
        } else {
            return true;
        }
        return false;
    }

    function copyIfFilesDiffer(from, to) {

        var doCopy = false;
        var srcContent;

        if (path.existsSync(to)) {
            var fromstat =fs.lstatSync(from);
            var tostat =fs.lstatSync(to);

            if (fromstat.size === tostat.size) {
                srcContent = fs.readFileSync(from);
                var destContent = fs.readFileSync(to);

                if (String(srcContent) !== String(destContent)) {
                    doCopy = true;
                }
            } else {
                doCopy = true;
            }
        } else {
            doCopy = true;
        }

        if (doCopy) {
            if (!srcContent) {
                srcContent = fs.readFileSync(from);
            }
            grunt.file.mkdir(path.dirname(to));

            fs.writeFileSync(to, srcContent);
        }
    }

    /* Project config */

    grunt.initConfig({
        requirejs: {
            appDir: 'src/modules',
            dir: path.join(tmp, 'modules.fresh'),
            baseUrl: '.',
            paths: {
                /* These CDN URLs have local fallbacks in src/modules/main.js */
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
            /* Bend the module array into a require.js-pleasing shape */
            modules: (function(){ return modules.map(function(name) { return {name:name}; }); }())
        },
        copyifchanged: {
            modules: {
                srcDir: path.join(tmp, 'modules.fresh'),
                src: '**/*.js',
                dest: path.join(tmp, 'modules')
            }
        },
        copy: {
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
        handlebars: {
            all: {
                src: 'src/templates/**/*.handlebars',
                dest: path.join(tmp, 'templates/all.js')
            }
        },
        compass: {
            dev: {
                src: 'src/stylesheets',
                dest: path.join(tmp, 'css')
            },
            prod: {
                src: 'src/stylesheets',
                dest: path.join(tmp, 'css')
            }
        },
        csslint: {
            all: {
                src: path.join(tmp, '**/*.css'),
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
        multiCompile: {
            js_dev: {
                task: 'closureCompiler',
                /* Source is only the js that was output from r.js, inferred by the module list. Omit the main module as
                 * we will do that separately, linked with any helper js files we may have. */
                src: (function(){ return modules.slice(1).map(function(name) { return path.join(tmp, 'modules', name + '.js'); }); }()),
                srcDir: path.join(tmp, 'modules'),
                maps: (function(){ return modules.slice(1).map(function(name) { return path.join('public/js', name + '.map'); }); }()),
                opts: closureopts('', 'public/js')
            },
            js_prod: {
                task: 'closureCompiler',
                /* Source is only the js that was output from r.js, inferred by the module list. Omit the main module as
                 * we will do that separately, linked with any helper js files we may have. */
                src: (function(){ return modules.slice(1).map(function(name) { return path.join(tmp, 'modules', name + '.js'); }); }()),
                srcDir: path.join(tmp, 'modules'),
                opts: closureopts('', 'public/js')
            }
        },
        closureCompiler: {
            main_helpers_dev: closureopts(['vendor/js/console-helper.min.js', path.join(tmp, 'modules/main.js')], 'public/js/main.js', 'public/js/main.map'),
            main_helpers_prod: closureopts(['vendor/js/console-helper.min.js', path.join(tmp, 'modules/main.js')], 'public/js/main.js'),
            templates_dev: closureopts([path.join(tmp, 'templates/**/*.js')], 'public/js/templates/all.js', 'public/js/templates/all.map'),
            templates_prod: closureopts([path.join(tmp, 'templates/**/*.js')], 'public/js/templates/all.js')
        },
        lint: {
            dev:  ['grunt.js', 'src/**/*.js', 'test/**/*.js'],
            prod: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
        },
        jshint: {
            dev:  (function() { return lintopts(true); }()), /* true for in-dev option */
            prod: (function() { return lintopts(false); }()) /* false for production (no console) */
        },
        clean: {
            tmp:  tmp,
            out: 'public'
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

    /** Determines if a file has changed by comparing two different versions of it. */
    grunt.registerMultiTask('copyifchanged', 'Call a grunt task on a group of source files one at a time individually', function() {
        var srcDir = this.data.srcDir;
        var files = grunt.file.expandFiles(path.join(srcDir, this.file.src));
        var destDir = this.file.dest;
        files.forEach(function(f) {
            var name = f.substr(srcDir.length);
            var to = path.join(destDir, name);
            copyIfFilesDiffer(f, to);
        });
    });

    /** Like closureCompiler, but minifies source files individually without concat (require.js has already concatted enough) */
    grunt.registerMultiTask('multiCompile', 'Call a grunt task on a group of source files one at a time individually', function() {
        var files = grunt.file.expandFiles(this.data.src);
        var opts = this.data.opts;
        var outdir = opts.output_file;
        var leading = this.data.srcDir.length;
        var done = this.async();

        var compile = function(f, files, maps) {
            opts.js = f.replace(/\\/g, '/');
            opts.output_file = path.join(outdir, f.substr(leading)).replace(/\\/g, '/');

            grunt.file.mkdir(path.dirname(opts.output_file));

            if (maps !== undefined) {
                opts.options.create_source_map = maps[0];
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
        }
    });

    grunt.registerMultiTask('handlebars', 'Precompile Handlebars templates', function() {
        var done = this.async();
        var files = grunt.file.expandFiles(this.data.src);

        if(!shouldBuild(this.data.dest, files)) {
            /* Skip (modified dates excuse us) */
            grunt.log.writeln("Skipping "+this.data.src+" (Not modified)");
            done(true);
            return false;
        }

        var destDir = path.dirname(this.data.dest);

        try {
            fs.mkdirSync(path.resolve(destDir));
        } catch(e) {
            /* Folder exists. Fine, ignore. */
        }

        var cmd = 'handlebars ' + files + ' -f ' + this.data.dest;

        grunt.helper('executeCommand', cmd, done);
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

    grunt.registerTask('default', 'lint:dev requirejs copyifchanged:modules handlebars:all multiCompile:js_dev closureCompiler:main_helpers_dev closureCompiler:templates_dev compass:prod csslint cssmin copy:images copy:pages');
    grunt.registerTask('production', 'clean lint:prod requirejs copyifchanged:modules handlebars:all multiCompile:js_prod closureCompiler:main_helpers_prod closureCompiler:templates_prod compass:prod csslint cssmin copy:images copy:pages');
};
