/*global require:true*/
module.exports = function(grunt) {

    'use strict';

    var shouldBuild = require('./lib/shouldBuild');

    grunt.registerMultiTask('templatize', 'Call another task, processing strings for templates in its options. Useful if a 3rd party task has forgotten to support templates.', function() {
        var processObject = function(o) {
            for(var p in o) {
                if(o.hasOwnProperty(p)) {
                    var v = o[p];
                    var t = typeof(v);
                    if (t === 'string') {
                        o[p] = grunt.template.process(v);
                    } else if(t === 'object') {
                        o[p] = processObject(v);
                    }
                }
            }
            return o;
        };

        var done = this.async();

        var opts = processObject(this.data.opts);

        var dotask = true;
        if (this.data.dest_param !== undefined) {
            var out = opts[this.data.dest_param];
            var ins = grunt.file.expandFiles(opts[this.data.srcs_param]);
            dotask = shouldBuild(grunt, out, ins);
        }

        if(dotask) {
            grunt.helper(this.data.task, opts, done);
        } else {
            done();
        }
    });

};
