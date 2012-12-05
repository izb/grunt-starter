/*global require:true*/
module.exports = function(grunt) {

    'use strict';

    var path = require('path');
    var copyIfFilesDiffer = require('./lib/copyIfFilesDiffer');

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


};
