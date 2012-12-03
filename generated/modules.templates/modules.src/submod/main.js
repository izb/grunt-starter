define([], function() {

    /* Hide these from r.js by storing in a variable. */
    var templateFiles = ['use!handlebars', 'alltemplates'];

    require(templateFiles, function(Handlebars) {
        /* Loading templates populates the Handlebars.templates object */
    });

    /* TODO: How do we ensure this submod is ready before we return? */

    return {
        version: 1
    };

});
