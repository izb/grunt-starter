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
    var modules = ['main', 'showpic/main'];

    var nonmodules = ['use', 'use!handlebars', 'tmplPersons'];

    /* Option generator functions */
    var closureopts = require('./tasks/lib/closureopts');
    var lintopts = require('./tasks/lib/lintopts');

    /* 3rd party tasks */

    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-clean');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-compass');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-closure-tools');

    grunt.loadTasks('tasks');

    /* Helper functions */

    var shouldBuild = require('./tasks/lib/shouldBuild');
    var copyIfFilesDiffer = require('./tasks/lib/copyIfFilesDiffer');

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
        pngout: {
            images: {
                srcDir: 'src/assets/images',
                src: '**/*.png',
                dest: '<%= vars.out %>/images'
            },
            spritesheets: {
                srcDir: path.join(tmp, 'sprites'),
                src: '*.png',
                dest: '<%= vars.out %>/images'
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
            sourcemapsources: {
                srcDir: tmp,
                src: ['templates.amd/**/*.js', 'modules/**/*.js'],
                dest: '<%= vars.out %>/mappedsrc'
            },
            images: {
                srcDir: 'src/assets/images',
                src: ['**/*.jpg','**/*.jpeg','**/*.gif','*.ico'],
                dest: '<%= vars.out %>/images'
            },
            sprites: {
                srcDir: 'src/assets/sprites',
                src: ['**/*.jpg','**/*.jpeg','**/*.png','**/*.gif'],
                dest: path.join(tmp, 'sprites')
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
            },
            css: {
                srcDir: path.join(tmp, 'css'),
                src: ['*.css'],
                dest: '<%= vars.out %>/css'
            },
            compressed_images: {
                srcDir: 'src/assets/images',
                src: ['**/*.png'],
                dest: '<%= vars.out %>/images'
            },
            compressed_spritesheets: {
                srcDir: path.join(tmp, 'sprites'),
                src: ['*.png'],
                dest: '<%= vars.out %>/images'
            }
        },
        maplink: {
            dev: {
                src: '<%= vars.out %>/js',
                rootpath: '/js', /* Note a dev build might build to a subfolder on a local server. You might need to tweak this. */
                srcroot: '<%= vars.out %>/js',
                badmaproot: tmp,
                goodmaproot: '/mappedsrc' /* ... also this. */
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
                generated_images_dir: '<%= vars.out %>/images',
                outputstyle: 'expanded'
            },
            prod: {
                src: 'src/stylesheets',
                dest: path.join(tmp, 'css'),
                images: path.join(tmp, 'sprites'),
                generated_images_dir: '<%= vars.out %>/images',
                outputstyle: 'compressed'
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
                src: '<%= vars.out %>/css',
                /* disable some rules that scss output violates and over which we have no practical control. */
                rules: {
                    "adjoining-classes": false
                }
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

    /* Alias tasks */

    grunt.registerTask('modules', 'copyifchanged:fallbacks copyifchanged:scripts_vendor requirejs:modules copyifchanged:modules');
    grunt.registerTask('templates', 'handlebars:persons amdwrap:templates');
    grunt.registerTask('css_dev', 'copyifchanged:sprites compass:dev replace:css_sprites csslint copyifchanged:css copyifchanged:compressed_spritesheets');
    grunt.registerTask('css_prod', 'copyifchanged:sprites compass:prod replace:css_sprites csslint copyifchanged:css pngout:spritesheets');
    grunt.registerTask('sourcemapping', 'maplink:dev copyifchanged:sourcemapsources');
    grunt.registerTask('statics_dev', 'copyifchanged:compressed_images copyifchanged:images copyifchanged:pages');
    grunt.registerTask('statics_prod', 'pngout:images copyifchanged:images copyifchanged:pages');
    grunt.registerTask('jsmin_dev', 'templatize:templates_persons_dev multiCompile:js_dev templatize:main_helpers_dev sourcemapping');
    grunt.registerTask('jsmin_prod', 'templatize:templates_persons_prod multiCompile:js_prod templatize:main_helpers_prod');
    grunt.registerTask('test', 'mocha');

    /* CLI tasks */

    grunt.registerTask('notest', 'initDev lint:dev templates modules jsmin_dev css_dev statics_dev');
    grunt.registerTask('default', 'notest test summarize');
    grunt.registerTask('rebuild', 'clean default');
    grunt.registerTask('rebuildproduction', 'clean production');
    grunt.registerTask('production', 'initProd clean lint:prod templates modules jsmin_prod css_prod statics_prod test summarize');
};
