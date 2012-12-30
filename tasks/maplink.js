module.exports = function(grunt) {

    'use strict';

    var path = require('path');
    var fs = require('fs');

    grunt.registerMultiTask('maplink', 'Add source-map comments into generated JS files', function() {
        var data = this.data;
        var done = this.async();
        var _this = this;
        var slice = grunt.template.process(data.srcroot).length;
        var src = grunt.template.process(data.src);
        var rootpath = grunt.template.process(data.rootpath);

        var files = grunt.file.expandFiles(path.join(src, "**/*.map"));

        if (files) {
            files.map(function (f) {
                var comment = '//@ sourceMappingURL=' + rootpath + f.substring(slice);
                var i = f.lastIndexOf('.');
                var js = f.substring(0,i) + '.js';
                if(fs.existsSync(js)) {
                    var script = grunt.task.directive(js, grunt.file.read);
                    var endOfScript = '';
                    if (comment.length < script.length) {
                        endOfScript = script.substr(script.length - comment.length, comment.length);
                    }
                    if (endOfScript !== comment) {
                        grunt.file.write(js, script + comment);
                    }
                }

                var mapdata = grunt.task.directive(f, grunt.file.read);
                var badroot = '"sources":["'+data.badmaproot;
                if (mapdata.indexOf(badroot)>=0) {
                    mapdata = mapdata.replace(badroot, '"sources":["'+data.goodmaproot);
                    grunt.file.write(f, mapdata);
                }
            });
        }

        done();
    });
};
