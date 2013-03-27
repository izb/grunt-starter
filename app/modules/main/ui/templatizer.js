define(['jquery','templates/persons'], function($,tmpl) {

    'use strict';

    function Templatizer() {

    }

    Templatizer.prototype.render = function(list) {
        $('#container').html(tmpl['names'](list));
    };

    Templatizer.prototype.renderAges = function(list) {
        $('#container').html(tmpl['ages'](list));
    };

    return Templatizer;
});
