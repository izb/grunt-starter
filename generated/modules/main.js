
/*!
 * use.js v0.3.0
 * Copyright 2012, Tim Branyen (@tbranyen)
 * use.js may be freely distributed under the MIT license.
 */
(function(a){var b={};define('use',{version:"0.3.0",load:function(c,d,e,f){f||(f=require.rawConfig);var g=f.use&&f.use[c];if(!g)throw new TypeError("Module '"+c+"' is undefined or does not"+" have a `use` config. Make sure it exists, add a `use` config, or"+" don't use use! on it");b[c]={deps:g.deps||[],attach:g.attach},d(g.deps||[],function(){var b=arguments;d([c],function(){var c=g.attach;return f.isBuild?e():typeof c=="function"?e(c.apply(a,b)):e(a[c])})})},write:function(a,c,d){var e=b[c],f=e.deps,g={attach:null,deps:""};typeof e.attach=="function"?g.attach=e.attach.toString():g.attach=["function() {","return typeof ",String(e.attach),' !== "undefined" ? ',String(e.attach)," : void 0;","}"].join(""),f.length&&(g.deps="'"+f.toString().split(",").join("','")+"'"),d(["define('",a,"!",c,"', ","[",g.deps,"], ",g.attach,");\n"].join(""))}})})(this);
define('submod/main',[], function() {

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

define('main',["use", "jquery", "lodash", "submod/main"],
function(use,   $,        _,        submod) {

    /* Main entry point */
    return {
        submodVer: submod.version,

        sayok: function() {
            return "ok";
        }
    };

}, function (err) {
    var cdnFallbacks = { jquery: 'js/jquery-1.8.3.min', lodash: 'js/lodash-0.10.0.min' };
    var id = err.requireModules && err.requireModules[0];
    if (cdnFallbacks.hasOwnProperty(id)) {
        requirejs.undef(id);
        var newpaths = {};
        newpaths[id] = cdnFallbacks[id];
        requirejs.config({ paths: newpaths });
        require([id], function () {});
    } else {
        // TODO: Report error? No fallback, or other error.
    }
});
