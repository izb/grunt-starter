/*global require:true,console:true*/
module.exports = function(grunt) {

    'use strict';

    var path = require('path');
    var shouldBuild = require('./lib/shouldBuild');

    grunt.registerMultiTask('pngout', 'Optimize png files', function() {
        var files = grunt.file.expandFiles(path.join(this.data.srcDir, this.data.src));
        if (files.length===0) {
            return;
        }
        var dest = this.data.dest;
        var leading = this.data.srcDir.length;
        var done = this.async();

        var compress = function(f, files) {
            var output_file = grunt.template.process(path.join(dest, f.substr(leading)).replace(/\\/g, '/'));
            grunt.file.mkdir(path.dirname(output_file));

            if(!shouldBuild(grunt, output_file, [f])) {
                if(files.length===0) {
                    done();
                    return;
                }
                compress(files[0], files.slice(1));
                return;
            }

            var cmd = 'pngout "./' + f + '" "./' + output_file + '" -s0 -y -q -force';
            if (files.length>0) {
                grunt.helper('executeCommand', cmd, function() {
                    compress(files[0], files.slice(1));
                });
            } else {
                grunt.helper('executeCommand', cmd, done);
            }
        };

        if(files.length > 0) {
            compress(files[0], files.slice(1));
        } else {
            done();
        }
    });

};
