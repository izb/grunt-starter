define(['jquery', 'lodash','ui/templatizer', 'datasource/main'], function($, _, Templatizer, DataSource) {

    'use strict';

    function UI() {
        this.tmpl = new Templatizer();
        this.data = new DataSource();

        var _this = this;

        $('#showages').click(function() {_this.onShowAges();});
    }

    UI.prototype.onShowAges = function() {
        var people = this.data.getData();
        this.tmpl.renderAges({items:people});
    };

    UI.prototype.renderData = function() {
        var people = this.data.getData();
        this.tmpl.render({items:people});
    };

    return UI;
});
