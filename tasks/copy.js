module.exports = function(grunt) {

    'use strict';

    var path = require('path');
    var shouldBuild = require('./lib/shouldBuild');

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

};
