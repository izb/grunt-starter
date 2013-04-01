/*jshint node: true */
/*global module:false */
module.exports = function(grunt) {

    'use strict';

    /* TODO: Comment the darned heck out of this file */

    var fs = require('fs');

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-closurecompiler'); /* C-C-C-C-Combo breaker! */
    grunt.loadNpmTasks('grunt-mocha');

    var requireConfig = {
        baseUrl: 'js/',
        paths: {
            jquery: ['http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min', 'jquery.min'],
            lodash: ['http://cdnjs.cloudflare.com/ajax/libs/lodash.js/1.0.0-rc.3/lodash.min', 'lodash.min'],
            /* TODO: Handlebars isn't minified in the fallback */
            handlebars: ['http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0-rc.3/handlebars.runtime.min', 'handlebars.runtime']
        },
        shim: {
            handlebars: {
                exports: 'Handlebars'
            }
        }
    };

    var requireConfigDev = {
        baseUrl: 'js/',
        paths: {
            jquery: 'jquery',
            lodash: 'lodash',
            handlebars: 'handlebars.runtime'
        },
        shim: {
            handlebars: {
                exports: 'Handlebars'
            }
        }
    };

    /** Returns true if the source is newer than the destination.
     */
    var isNewer = function(src,dest) {
        if (!fs.existsSync(dest)) {
            return true;
        }
        var fromstat =fs.statSync(src);
        var tostat =fs.statSync(dest);
        return(fromstat.mtime>tostat.mtime);
    };

    /** Where there are many files that compile to one, this returns true
     * if any of the input files are newer than the output.
     */
    var manyToOne = function(dest, src) {
        var compile = true;
        if (fs.existsSync(dest)) {
            var from = grunt.file.expand(src);
            var tostat =fs.statSync(dest);
            compile = false;
            for (var i = from.length - 1; i >= 0; i--) {
                if(fs.statSync(from[i]).mtime>tostat.mtime) {
                    compile = true;
                    break;
                }
            }
        }
        return [{dest:dest, src:compile?src:[]}];
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            production:  ['Gruntfile.js', 'app/modules/**/*.js'],
            dev: {
                options: {
                    devel:true
                },
                src:  ['Gruntfile.js', 'app/modules/**/*.js']
            }
        },
        clean: ["tmp", ".sass-cache", "dist"],
        copy: {
            modulesTmp: {
                files: [{
                    expand:true,cwd:"app/modules/", dest:"tmp/modules/", src:["**/*.js"],
                    filter: function(from) {
                        return isNewer(from, "tmp"+from.substring(3));
                    }
                }]
            },
            modules: {
                files: [{
                    expand:true, cwd:"tmp/modules.amd/", dest:"dist/js/", src:["**/*.js"],
                    filter: function(from) {
                        return isNewer(from, "dist/js"+from.substring(15));
                    }
                }]
            },
            pages: {
                files: [{
                    expand:true,cwd:"app/pages/", dest:"dist/", src:["**/*.htm", "**/*.html", "**/*.php"],
                    filter: function(from) {
                        return isNewer(from, "dist"+from.substring(9));
                    }
                }]
            },
            images: {
                files: [{
                    expand:true,cwd:"app/images/", dest:"dist/images/", src:["**/*.jpg", "**/*.jpeg", "**/*.png"],
                    filter: function(from) {
                        return isNewer(from, "dist/images"+from.substring(10));
                    }
                }]
            },
            spritesheets: {
                files: [{
                    expand:true,cwd:"tmp/images/", dest:"dist/images/", src:["**/*.png"],
                    filter: function(from) {
                        return isNewer(from, "dist/images"+from.substring(10));
                    }
                }]
            },
            css: {
                files: [{
                    expand:true, cwd:"tmp/css/", dest:"dist/css/", src:["**/*.css"],
                    filter: function(from) {
                        return isNewer(from, "dist/css"+from.substring(7));
                    }
                }]
            },
            componentsmin: {
                files: [
                    {dest:"dist/js/jquery.min.js", src:"component/jquery/jquery.min.js"},
                    {dest:"dist/js/handlebars.runtime.js", src:"component/handlebars/handlebars.runtime.js"},
                    {dest:"dist/js/lodash.min.js", src:"component/lodash/dist/lodash.min.js"}
                ]
            },
            components: {
                files: [
                    {dest:"dist/js/jquery.js", src:"component/jquery/jquery.js"},
                    {dest:"dist/js/handlebars.runtime.js", src:"component/handlebars/handlebars.runtime.js"},
                    {dest:"dist/js/lodash.js", src:"component/lodash/dist/lodash.js"}
                ]
            }
        },
        handlebars: {
            options: {
                amd: true,
                namespace: 'hbs',
                processName: function(name) {
                    var pieces = name.split("/");
                    return pieces[pieces.length - 1].replace('.hbs', '');
                }
            },
            persons:{
                files:manyToOne("tmp/modules/templates/persons.js",["app/templates/persons/*.hbs"])
            }
        },
        requirejs: {
            options: {
                mainConfigFile: "r.config.js",
                logLevel: 3,
                paths: {
                    jquery: "empty:../../component/jquery/jquery.min",
                    lodash: "empty:../../component/lodash/dist/lodash.min",
                    handlebars: "empty:../../component/handlebars/handlebars.runtime"
                },
                shim: {
                    handlebars: {
                        exports: 'Handlebars'
                    }
                }
            },
            app: {
                options: {
                    modules: [
                        {
                            name: "main/main"
                        },
                        {
                            name: "datasource/main"
                        },
                        {
                            name: "showpic/main"
                        }
                    ]
                }
            }
        },
        closurecompiler: {
            options: {
                compilation_level: "SIMPLE_OPTIMIZATIONS",
                warning_level: 'quiet',
                summary_detail_level: 3
            },
            modules: {
                files:[{
                    expand:true, cwd:"tmp/modules.amd/", dest:"dist/js/", src:["**/*.js"],
                    filter: function(from) {
                        return isNewer("tmp/modules"+from.substring(15), "dist/js"+from.substring(15));
                    }
                }]
            },
            require: {
                options: {
                    output_wrapper: "\"%output%require.config("+JSON.stringify(requireConfig).replace(/"/g, '\\"')+");\""
                },
                files:[{
                    dest:"dist/js/require.js", src:["component/requirejs/require.js"],
                    filter: function(from) {
                        return isNewer(from, "dist/js/require.js");
                    }
                }]
            }
        },
        concat: {
            requireDev: {
                options: {
                    footer: "require.config("+JSON.stringify(requireConfigDev, null, 4)+");"
                },
                src:["component/requirejs/require.js"],
                dest:"dist/js/require.js"
            }
        },
        compass: {
            options: {
                config: 'compass.config.rb'
            },
            main: {
                options: {
                    sassDir: 'app/stylesheets/main',
                    cssDir: 'tmp/css/main'
                }
            }
        },
        cssmin: {
            all: {
                files:[{
                    expand:true, cwd:"tmp/css/", dest:"dist/css/", src:["**/*.css"],
                    filter: function(from) {
                        return isNewer(from, "dist/css"+from.substring(7));
                    }
                }]
            }
        },
        imagemin: {
            options: {
                optimizationLevel: 3,
                progressive: true
            },
            images: {
                files: [{
                    expand:true,cwd:"app/images/", dest:"dist/images/", src:["**/*.jpg", "**/*.jpeg", "**/*.png"],
                    filter: function(from) {
                        return isNewer(from, "dist/images"+from.substring(10));
                    }
                }]
            },
            spritesheets: {
                files: [{
                    expand:true,cwd:"tmp/images/", dest:"dist/images/", src:["**/*.png"],
                    filter: function(from) {
                        return isNewer(from, "dist/images"+from.substring(16));
                    }
                }]
            }
        },
        mocha: {
            options: {
                mocha: {
                    ignoreLeaks: false
                },
                reporter:'Spec',
                run: false
            },
            all: {
                src: ["app/test/**/*.html"]
            }
        },
        watch: {
            images: {
                files: ['app/images/**/*.png','app/images/**/*.jpeg','app/images/**/*.jpg'],
                tasks: ['dev.images']
            },
            modules: {
                files: ['app/modules/**/*.js'],
                tasks: ['dev.modules']
            },
            pages: {
                files: ['app/pages/**/*.htm','app/pages/**/*.php','app/pages/**/*.html'],
                tasks: ['dev.pages']
            },
            sprites: {
                files: ['app/sprites/**/*.png'],
                tasks: ['dev.stylesheets']
            },
            stylesheets: {
                files: ['app/stylesheets/**/*.scss','app/stylesheets/**/*.css'],
                tasks: ['dev.stylesheets']
            },
            templates: {
                files: ['app/templates/**/*.hbs'],
                tasks: ['dev.modules']
            },
            test: {
                files: ['app/test/**/*.htm','app/test/**/*.php','app/test/**/*.html','app/test/**/*.js'],
                tasks: ['test']
            }
        }
    });

    /* Development */
    grunt.registerTask('components', ['copy:components', 'concat:requireDev']);
    grunt.registerTask('dev.stylesheets', ['compass:main', 'copy:spritesheets', 'copy:css']);
    grunt.registerTask('dev.pages', ['copy:pages']);
    grunt.registerTask('dev.images', ['copy:images']);
    grunt.registerTask('dev.modules', ['components', 'copy:modulesTmp', 'handlebars:persons', 'requirejs:app', 'copy:modules']);

    /* Production */
    grunt.registerTask('componentsmin', ['copy:componentsmin', 'closurecompiler:require']);
    grunt.registerTask('stylesheets', ['compass:main', 'imagemin:spritesheets', 'cssmin:all']);
    grunt.registerTask('pages', ['copy:pages']);
    grunt.registerTask('images', ['imagemin:images']);
    grunt.registerTask('modules', ['components', 'copy:modulesTmp', 'handlebars:persons', 'requirejs:app', 'closurecompiler:modules']);

    grunt.registerTask('production', ['clean', 'jshint:production', 'pages', 'modules', 'stylesheets', 'images']);
    grunt.registerTask('default', ['jshint:dev', 'dev.pages', 'dev.modules', 'dev.stylesheets', 'dev.images']);
    grunt.registerTask('dev', ['default']);

    grunt.registerTask('test', ['mocha:all']);
};
