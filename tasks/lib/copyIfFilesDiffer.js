module.exports = function copyIfFilesDiffer(grunt, from, to) {

    'use strict';

    var fs = require('fs');
    var path = require('path');

    var doCopy = false;
    var srcContent;

    if (path.existsSync(to)) {
        var fromstat =fs.lstatSync(from);
        var tostat =fs.lstatSync(to);

        if (fromstat.size === tostat.size) {
            srcContent = fs.readFileSync(from);
            var destContent = fs.readFileSync(to);

            if (String(srcContent) !== String(destContent)) {
                doCopy = true;
            }
        } else {
            doCopy = true;
        }
    } else {
        doCopy = true;
    }

    if (doCopy) {
        if (!srcContent) {
            srcContent = fs.readFileSync(from);
        }
        grunt.file.mkdir(path.dirname(to));

        fs.writeFileSync(to, srcContent);
    }
};
