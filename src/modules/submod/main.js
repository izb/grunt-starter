define([], function() {

    /* Hide these from r.js by storing in a variable. */
    var templateFiles = ['use!handlebars', 'alltemplates'];

    require(templateFiles, function(Handlebars) {
        /* Loading templates populates the Handlebars.templates object */
    });

    return {
        version: 1
    };

});
