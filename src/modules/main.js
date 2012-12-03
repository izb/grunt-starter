define(["use", "jquery", "use!underscore", "submod/main"],
function(use,   $,        _,                submod) {

    /* Main entry point */
    return {
        submodVer: submod.version,

        sayok: function() {
            return "ok";
        }
    };

}, function (err) {
    var cdnFallbacks = { jquery: 'js/jquery-1.7.2.min.js', underscore: 'js/underscore-1.3.3.min.js' };
    var id = err.requireModules && err.requireModules[0];
    if (cdnFallbacks.hasOwnProperty(id)) {
        requirejs.undef(id);
        var newpaths = {};
        newpaths[id] = cdnFallbacks[id];
        requirejs.config({ paths: newpaths });
        require([id], function () {});
    } else {
        // TODO: Report error? No fallback, or other error.
    }
});
