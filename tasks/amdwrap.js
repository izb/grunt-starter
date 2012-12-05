/*global require:true*/
module.exports = function(grunt) {

    'use strict';

    var path = require('path');
    var shouldBuild = require('./lib/shouldBuild');

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

};
