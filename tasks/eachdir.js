/*global require:true*/
module.exports = function(grunt) {

    'use strict';

    var fs = require('fs');

    var shouldBuild = require('./lib/shouldBuild');

    grunt.registerMultiTask('eachdir', 'Repeats a task in each subfolder of a directory.', function() {

        var dirs = fs.readdirSync(this.data.src).filter(function(p) {var s = fs.statSync(p);return s.isDirectory();});

        var done = this.async();


        var runtask = function(d, dirs) {

            if(!shouldBuild(grunt, opts.output_file, [opts.js])) {
                if(dirs.length===0) {
                    done();
                    return;
                }
                runtask(dirs[0], dirs.slice(1));
                return;
            }

            if (dirs.length>0) {
                grunt.helper('closureCompiler', opts, function() {
                    runtask(dirs[0], dirs.slice(1));
                });
            } else {
                grunt.helper('closureCompiler', opts, done);
            }
        };

        if(dirs.length > 0) {
            runtask(dirs[0], dirs.slice(1));
        } else {
            done();
        }


        // var opts = processObject(this.data.opts);

        // var dotask = true;
        // if (this.data.dest_param !== undefined) {
        //     var out = opts[this.data.dest_param];
        //     var ins = grunt.file.expandFiles(opts[this.data.srcs_param]);
        //     dotask = shouldBuild(grunt, out, ins);
        // }

        // if(dotask) {
        //     grunt.helper(this.data.task, opts, done);
        // } else {
        //     done();
        // }
    });

};
