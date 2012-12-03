define([], function(handlebars) {

    /* Hide these from r.js by storing in a variable. */
    var templateFiles = ['use!handlebars', 'templates/all'];

    require(templateFiles, function(handlebars, tmpl) {
        console.log(tmpl);
    });

    /* TODO: How do we ensure this submod is ready before we return? */

    return {
        version: 1
    };

});
