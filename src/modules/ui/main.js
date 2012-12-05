define(['lodash','ui/templatizer', 'datasource/main'], function(_, Templatizer, DataSource) {

    'use strict';

    function UI() {
        this.tmpl = new Templatizer();
        this.data = new DataSource();
    }

    UI.prototype.renderData = function() {
        var people = this.data.getData();
        this.tmpl.render({items:people});
    };

    return UI;
});
