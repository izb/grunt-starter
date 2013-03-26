/*jshint node: true */
/*global module:false */
module.exports = function(grunt) {

    'use strict';

    var fs = require('fs');

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-closurecompiler');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    var isNewer = function(src,dest) {
        if (!fs.existsSync(dest)) {
            return true;
        }
        var fromstat =fs.statSync(src);
        var tostat =fs.statSync(dest);
        return(fromstat.mtime>tostat.mtime);
    };

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
            build:  ['Gruntfile.js', 'app/modules/**/*.js']
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
                        return isNewer("tmp/modules"+from.substring(15), "dist/js"+from.substring(15));
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
                        return isNewer(from, "dist/images"+from.substring(16));
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
            }
        },
        handlebars: {
            options: {
                namespace: "JST",
                amd: true
            },
            persons:{
                files:manyToOne("tmp/modules/templates/persons.js",["app/templates/persons/*.hbs"])
            }
        },
        requirejs: {
            options: {
                mainConfigFile: "r.config.js",
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
                            name: "main/main",
                        },
                        {
                            name: "datasource/main",
                        },
                        {
                            name: "showpic/main",
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
        }
    });

    /* Development */
    grunt.registerTask('dev.stylesheets', ['compass:main', 'copy:spritesheets', 'copy:css']);
    grunt.registerTask('dev.pages', ['copy:pages']);
    grunt.registerTask('dev.images', ['copy:images']);
    grunt.registerTask('dev.modules', ['copy:modulesTmp', 'handlebars:persons', 'requirejs:app', 'copy:modules']);

    /* Production */
    grunt.registerTask('stylesheets', ['compass:main', 'imagemin:spritesheets', 'cssmin:all']);
    grunt.registerTask('pages', ['copy:pages']);
    grunt.registerTask('images', ['imagemin:images']);
    grunt.registerTask('modules', ['copy:modulesTmp', 'handlebars:persons', 'requirejs:app', 'closurecompiler:modules']);

    grunt.registerTask('production', ['pages', 'modules', 'stylesheets', 'images']);
    grunt.registerTask('default', ['dev.pages', 'dev.modules', 'dev.stylesheets', 'dev.images']);
};
