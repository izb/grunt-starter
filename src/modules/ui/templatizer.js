define(['jquery','use!handlebars','alltemplates'], function($,Handlebars) {

    function Templatizer() {

    }

    Templatizer.prototype.render = function(list) {
        $('#container').html(Handlebars.templates.listitem(list));
    };

    return Templatizer;
});