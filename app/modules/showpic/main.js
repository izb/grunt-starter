/*global define*/
/* A simple on-demand module that puts a picture onto the page. */

define(['jquery'], function($) {

    'use strict';

    function ShowPic() {
    }

    ShowPic.prototype.show = function() {
        $('<img src="images/showpic/scruffy.png" />').appendTo('#container');
    };

    return ShowPic;
});
