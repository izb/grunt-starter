/*jshint node: true */
/*global module:false */
module.exports = function(grunt) {

    'use strict';

    var fs = require('fs');
    var path = require('path');
    var exec = require('child_process').exec;

    /* Environmental options */

    var tmp = 'generated';

    /* Input file options */

    /* The main module is first. */
    var modules = ['main'];

    var nonmodules = ['use', 'use!handlebars', 'tmplPersons'];

    /* Option generator functions */
    var closureopts = require('./tasks/closureopts');
    var lintopts = require('./tasks/lintopts');

    /* 3rd party tasks */

    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-clean');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-compass');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-closure-tools');

    /* Helper functions */

    var shouldBuild = require('./tasks/shouldBuild');
    var copyIfFilesDiffer = require('./tasks/copyIfFilesDiffer');

    grunt.registerInitTask('initDev', 'Initialise development build', function() {

        grunt.log.writeln("This is a development build");

        grunt.config('vars.out', 'public.dev/www');

    });

    grunt.registerInitTask('initProd', 'Initialise production build', function() {

        grunt.log.writeln("This is a production build");

        grunt.config('vars.out', 'public/www');

    });

    grunt.registerInitTask('summarize', 'Summarize the build', function() {
        grunt.log.writeln("Build output can be found in " + grunt.config('vars.out'));
    });

    /* Project config */

    grunt.initConfig({
        requirejs: {
            modules: {
                appDir: 'src/modules',
                dir: path.join(tmp, 'modules.src'),
                baseUrl: '.',
                paths: {
                    /* These CDN URLs have local fallbacks in src/modules/main.js */
                    lodash: 'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/0.10.0/lodash.min',
                    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min',
                    use: '../../vendor/js/use.min',
                    handlebars: 'http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.rc.1/handlebars.min',
                    tmplPersons: '../../generated/templates.amd/persons'
                },
                use: {
                    handlebars: { attach: 'Handlebars' }
                },
                pragmas: {
                    doExclude: true
                },
                optimize: 'none',
                skipModuleInsertion: false,
                optimizeAllPluginResources: true,
                findNestedDependencies: true,
                /* Bend the module array into a require.js-pleasing shape */
                modules: (function(){ return modules.map(function(name) { return {name:name,excludeShallow:nonmodules}; }); }())
            }
        },
        copyifchanged: {
            modules: {
                /* r.js overwrites files regardless, so we cache the output in modules to preserve the precious modified stamps */
                srcDir: path.join(tmp, 'modules.src'),
                src: ['**/*.js'],
                dest: path.join(tmp, 'modules')
            },
            fallbacks: {
                srcDir: 'vendor/js',
                src: ['jquery-1.8.3.min.js', 'lodash-0.10.0.min.js'],
                dest: '<%= vars.out %>/js'
            },
            images: {
                srcDir: 'src/assets/images',
                src: ['**/*.jpg','**/*.jpeg','**/*.png','**/*.gif'],
                dest: '<%= vars.out %>/images'
            },
            sprites: {
                srcDir: 'src/assets/sprites',
                src: ['**/*.jpg','**/*.jpeg','**/*.png','**/*.gif'],
                dest: path.join(tmp, 'sprites')
            },
            spritesheets: {
                srcDir: path.join(tmp, 'sprites'),
                src: ['*.png'],
                dest: '<%= vars.out %>/images'
            },
            pages: {
                srcDir: 'src/assets',
                src: ['**/*.htm','**/*.html','**/*.php'],
                dest: '<%= vars.out %>'
            },
            scripts_vendor: {
                srcDir: 'vendor/js',
                src: ['require.js','use.min.js','handlebars.runtime-1.0.0.rc.1.min.js'],
                dest: '<%= vars.out %>/js'
            }
        },
        handlebars: {
            persons: {
                src: 'src/templates/persons',
                dest: path.join(tmp, 'templates/persons.js')
            }
        },
        compass: {
            dev: {
                src: 'src/stylesheets',
                dest: path.join(tmp, 'css'),
                images: path.join(tmp, 'sprites'),
                generated_images_dir: '<%= vars.out %>/images'
            },
            prod: {
                src: 'src/stylesheets',
                dest: path.join(tmp, 'css'),
                images: path.join(tmp, 'sprites'),
                generated_images_dir: '<%= vars.out %>/images'
            }
        },
        replace: {
            css_sprites: {
                src: [path.join(tmp, 'css/*.css')],
                overwrite: true,
                replacements: [{
                    from: 'url(\'/generated/sprites/',
                    to: "url('../images/"
                }]
            }
        },
        csslint: {
            all: {
                src: path.join(tmp, '**/*.css'),
                /* disable some rules that scss output violates and over which we have no practical control. */
                rules: {
                    "adjoining-classes": false
                }
            }
        },
        cssmin: {
            all: {
                src: ["vendor/stylesheets/normalize.css", path.join(tmp, '**/*.css'), "vendor/stylesheets/helpers.css"],
                dest: '<%= vars.out %>/css/all.css'
            }
        },
        multiCompile: {
            js_dev: {
                /* Source is only the js that was output from r.js, inferred by the module list. Omit the main module as
                 * we will do that separately, linked with any helper js files we may have. */
                src: (function(){ return modules.slice(1).map(function(name) { return path.join(tmp, 'modules', name + '.js'); }); }()),
                srcDir: path.join(tmp, 'modules'),
                maps: (function(){ return modules.slice(1).map(function(name) { return path.join('<%= vars.out %>/js', name + '.map'); }); }()),
                opts: closureopts('', '<%= vars.out %>/js')
            },
            js_prod: {
                /* Source is only the js that was output from r.js, inferred by the module list. Omit the main module as
                 * we will do that separately, linked with any helper js files we may have. */
                src: (function(){ return modules.slice(1).map(function(name) { return path.join(tmp, 'modules', name + '.js'); }); }()),
                srcDir: path.join(tmp, 'modules'),
                opts: closureopts('', '<%= vars.out %>/js')
            }
        },
        templatize: {

            /* templatize is a hack around grunt plugins that don't support templatized option values. */

            main_helpers_dev: {
                task: 'closureCompiler',
                opts:closureopts([path.join(tmp, 'modules/main.js')], '<%= vars.out %>/js/main.js', '<%= vars.out %>/js/main.map'),
                dest_param:'output_file',
                srcs_param:'js'
            },

            main_helpers_prod: {
                task: 'closureCompiler',
                opts:closureopts([path.join(tmp, 'modules/main.js')], '<%= vars.out %>/js/main.js'),
                dest_param:'output_file',
                srcs_param:'js'
            },

            templates_persons_dev: {
                task: 'closureCompiler',
                opts:closureopts([path.join(tmp, 'templates.amd/**/*.js')], '<%= vars.out %>/js/templates/persons.js', '<%= vars.out %>/js/templates/persons.map'),
                dest_param:'output_file',
                srcs_param:'js'
            },

            templates_persons_prod: {
                task: 'closureCompiler',
                opts:closureopts([path.join(tmp, 'templates.amd/**/*.js')], '<%= vars.out %>/js/templates/persons.js'),
                dest_param:'output_file',
                srcs_param:'js'
            }
        },
        lint: {
            dev:  ['grunt.js', 'src/**/*.js', 'test/mocha/**/*.js'],
            prod: ['grunt.js', 'src/**/*.js', 'test/mocha/**/*.js']
        },
        jshint: {
            dev:  (function() { return lintopts(true); }()), /* true for in-dev option */
            prod: (function() { return lintopts(false); }()) /* false for production (no console) */
        },
        clean: {
            tmp: tmp,
            out: 'public',
            outdev: 'public.dev',
            sasscache: '.sass-cache'
        },
        mocha: {
            index: ['test/mocha/browser/**/*.html']
        },
        amdwrap: {
            templates: {
                src: [path.join(tmp, 'templates/*.js')],
                dest: path.join(tmp, 'templates.amd'),
                wrapper: ['define([\'use!handlebars\'], function(Handlebars) {\n', '\n});']
            }
        },
        watch: {
             files: ['src/**/*','test/**/*','templates/**/*'],
             tasks: 'default'
        }
    });

    grunt.registerMultiTask('amdwrap', 'Wrap files in defines', function() {
        var files = grunt.file.expandFiles(this.file.src);
        var _this = this;

        if (files) {
            files.map(function (f) {
                var out = path.join(_this.file.dest, path.basename(f));
                if(shouldBuild(grunt, out, files)) {
                    var content = _this.data.wrapper[0] + grunt.task.directive(f, grunt.file.read) + _this.data.wrapper[1];
                    grunt.file.write(out, content);
                    /* TODO: How to determine if there's an error? We should return false if there is. */
                }
            });
        }

        return true;
    });

    /* Helper tasks */

    grunt.registerMultiTask('templatize', 'Call another task, processing strings for templates in its options. Useful if a 3rd party task has forgotten to support templates.', function() {
        var processObject = function(o) {
            for(var p in o) {
                if(o.hasOwnProperty(p)) {
                    var v = o[p];
                    var t = typeof(v);
                    if (t === 'string') {
                        o[p] = grunt.template.process(v);
                    } else if(t === 'object') {
                        o[p] = processObject(v);
                    }
                }
            }
            return o;
        };

        var done = this.async();

        var opts = processObject(this.data.opts);

        var dotask = true;
        if (this.data.dest_param !== undefined) {
            var out = opts[this.data.dest_param];
            var ins = grunt.file.expandFiles(opts[this.data.srcs_param]);
            dotask = shouldBuild(grunt, out, ins);
        }

        if(dotask) {
            grunt.helper(this.data.task, opts, done);
        } else {
            done();
        }
    });

    /** Copies files, only if the source is newer. */
    grunt.registerMultiTask('copyifchanged', 'Call a grunt task on a group of source files one at a time individually', function() {
        var srcDir = grunt.template.process(this.data.srcDir);
        var files = grunt.file.expandFiles(this.file.src.map(function(f) { return path.join(srcDir, f); }));
        var destDir = grunt.template.process(this.file.dest);

        files.forEach(function(f) {
            var name = f.substr(srcDir.length);
            var to = path.join(destDir, name);
            copyIfFilesDiffer(grunt, f, to);
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
            opts.output_file = grunt.template.process(opts.output_file);
            grunt.file.mkdir(path.dirname(opts.output_file));
            opts.checkModified = true;

            if(!shouldBuild(grunt, opts.output_file, [opts.js])) {
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


    grunt.registerMultiTask('handlebars-xx', 'Precompile Handlebars templates', function() {
        var data = this.data;
        var done = this.async();

        var files = grunt.file.expandFiles(data.src);

        grunt.file.mkdir(path.dirname(data.dest));
        grunt.file.mkdir(path.dirname(data.dest)+".amd");

        var precompile = function(f, files) {
            console.log(f, files, data.dest);
            if(!shouldBuild(grunt, data.dest, f)) {
                /* Skip (modified dates excuse us) */
                precompile(files[0], files.slice(1));
                return;
            }

            var cmd = 'handlebars ' + f + ' -f ' + data.dest;
            if (files.length>0) {
                grunt.helper('executeCommand', cmd, function() {
                    precompile(files[0], files.slice(1));
                });
            } else {
                grunt.helper('executeCommand', cmd, done);
            }
        };



        if(files.length > 0) {
            precompile(files[0], files.slice(1));
        } else {
            done();
        }
    });

    grunt.registerMultiTask('handlebars', 'Precompile Handlebars templates', function() {
        var data = this.data;
        var done = this.async();

        var files = grunt.file.expandFiles(path.join(data.src, "*.handlebars"));

        grunt.file.mkdir(path.dirname(data.dest));
        grunt.file.mkdir(path.dirname(data.dest)+".amd");

        if(!shouldBuild(grunt, data.dest, files)) {
            /* Skip (modified dates excuse us) */
            grunt.log.writeln("Skipping "+data.src+" (Not modified)");
            done(true);
            return false;
        }

        var cmd = 'handlebars ' + data.src + ' -f ' + data.dest;
        grunt.helper('executeCommand', cmd, done);
    });

    grunt.registerMultiTask( "copy", "Copy files from one folder to another", function() {

        var srcDir = this.data.srcDir;
        var files = grunt.file.expandFiles(this.file.src.map(function(f) { return path.join(srcDir, f); }));
        var dest = this.file.dest;

        files.forEach(function(f) {
            var out = path.join(dest, f.substr(srcDir.length));
            if(shouldBuild(grunt, out, [f])) {
                grunt.file.copy(f, out);
            }
        });

    });

    /* Alias tasks */

    grunt.registerTask('modules', 'copyifchanged:fallbacks copyifchanged:scripts_vendor requirejs:modules copyifchanged:modules');
    grunt.registerTask('templates', 'handlebars:persons amdwrap:templates');
    grunt.registerTask('css_dev', 'copyifchanged:sprites compass:dev replace:css_sprites csslint cssmin copyifchanged:spritesheets');
    grunt.registerTask('css_prod', 'copyifchanged:sprites compass:prod replace:css_sprites csslint cssmin copyifchanged:spritesheets');
    grunt.registerTask('statics', 'copyifchanged:images copyifchanged:pages');
    grunt.registerTask('jsmin_dev', 'templatize:templates_persons_dev multiCompile:js_dev templatize:main_helpers_dev');
    grunt.registerTask('jsmin_prod', 'templatize:templates_persons_prod multiCompile:js_prod templatize:main_helpers_prod');
    grunt.registerTask('test', 'mocha');

    /* CLI tasks */

    grunt.registerTask('default', 'initDev lint:dev templates modules jsmin_dev css_dev statics test summarize');
    grunt.registerTask('rebuild', 'clean default');
    grunt.registerTask('production', 'initProd clean lint:prod templates modules jsmin_prod css_prod statics test summarize');
};
