define(["ui/main"], function(UI) {

    'use strict';

    /* Main entry point */
    return function() {new UI().renderData();};

}, function (err) {
    var cdnFallbacks = {
        jquery: 'js/jquery-1.9.0.min',
        lodash: 'js/lodash-1.0.0-rc3.min',
        handlebars: 'js/handlebars.runtime-1.0.rc.2.min'
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
