/*global require:true*/
module.exports = function(grunt) {

    'use strict';

    var path = require('path');
    var shouldBuild = require('./lib/shouldBuild');

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


};
