define(['jquery','handlebars','templates/persons'], function($,Handlebars) {

    'use strict';

    function Templatizer() {

    }

    Templatizer.prototype.render = function(list) {
        $('#container').html(Handlebars.templates.names(list));
    };

    Templatizer.prototype.renderAges = function(list) {
        $(Handlebars.templates.ages(list)).appendTo('#container');
    };

    return Templatizer;
});
