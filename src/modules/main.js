require(["jquery", "underscore", "submod/main"],
function( $,        _,            submod) {

    /* Main entry point */
    return function main() {
        console.log("jQuery version " + $.fn.jquery);
        console.log("underscore version " + _.VERSION);
        console.log("submod version: " + submod.version);
        return "ok";
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
