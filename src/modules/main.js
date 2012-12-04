define(["ui/main"], function(UI) {

    /* Main entry point */
    return function() {new UI().renderData();};

}, function (err) {
    var cdnFallbacks = {
        jquery: 'js/jquery-1.8.3.min',
        lodash: 'js/lodash-0.10.0.min',
        handlebars: 'js/handlebars.runtime-1.0.0.rc.1.min'
    };
    var id = err.requireModules && err.requireModules[0];
    if (cdnFallbacks.hasOwnProperty(id)) {
        requirejs.undef(id);
        var newpaths = {};
        newpaths[id] = cdnFallbacks[id];
        requirejs.config({ paths: newpaths });
        require([id], function () {});
    } else {
        throw "Failed to load JS dependency";
    }
});
