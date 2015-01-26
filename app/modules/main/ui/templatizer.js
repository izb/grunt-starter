define(['jquery','templates/persons'], function($, persons) {

    'use strict';

    function Templatizer() {

    }

    Templatizer.prototype.render = function(list) {
        $('#container').html(persons['names'](list));
    };

    Templatizer.prototype.renderAges = function(list) {
        $(persons['ages'](list)).appendTo('#container');
    };

    return Templatizer;
});
