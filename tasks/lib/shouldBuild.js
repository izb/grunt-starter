/** Returns true if a given output file (out) is older than any of its array of
  * dependencies (ins) */
module.exports = function shouldBuild(grunt, out, ins) {

    'use strict';

    var fs = require('fs');
    var path = require('path');

    /* TODO: Should always rebuild if grunt.js is modified. Also check in closure compiler call */
    if (path.existsSync(out)) {
        var out_mtime =fs.lstatSync(out).mtime;
        for(var i = 0; i < ins.length; i++) {
            var f = ins[i];
            if (fs.lstatSync(f).mtime > out_mtime) {
                return true;
            }
        }
    } else {
        return true;
    }
    grunt.log.writeln("Skipped "+ins+" (Not modified)");
    return false;
};
