module.exports = function lintopts(isdev) {

    'use strict';

    return {
        options: {
            curly: true,
            eqeqeq: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            sub: true,
            undef: true,
            boss: true,
            eqnull: true,
            browser: true, /* Allow 'document' et al */
            devel: isdev
        },
        globals: {
            jQuery: true,
            require: true,
            requirejs: true,
            define: true
        }
    };
};
