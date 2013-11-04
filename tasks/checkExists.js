/*global module:true,console:true*/
module.exports = function(grunt) {

    'use strict';

    grunt.registerMultiTask( "checkExists", "Checks for the existence of given paths and fails the build if they're not there.", function() {

        this.data.paths.forEach(function(f) {
            if (grunt.file.expand(f).length===0) {
                grunt.fail.fatal(this.data.err);
            }
        }.bind(this));
    });

};
