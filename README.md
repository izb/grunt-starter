Grunt Starter
=============

The ultimate starter skeleton for your new website. Out of the box, you get a build script that generates a compact website. Check out this list of awesome features:

- Stylesheets using SCSS, built with Compass
- Incremental builds
- Generated spritesheets
- Fully AMD-compliant with CDN fallbacks for major libraries
- JavaScript compiled into single-download modules
- jQuery and lodash (underscore) out of the box
- Precompiled, AMD-compliant handlebar templates
- Minified CSS (UglifyCSS)
- CSS reset out of the box
- Minified JavaScript with Google's closure compiler
- Browser unit testing using phantomjs, mocha and chai

How to use
----------

### First time setup

There are a number of tools you need to have installed before you can create your first site with this script. You only need to do these once.

- Install [node.js](http://nodejs.org/)
- Install grunt globally (`npm install -g grunt`)
- Install handlebars globally (`npm install -g handlebars`)
- Install [pngout](http://advsys.net/ken/utils.htm) and make sure it's on your `PATH`
- Install [java](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and make sure `java` is on your `PATH`
- Install [ruby](http://www.ruby-lang.org) and make sure `ruby` is on your `PATH`
- Install [compass](http://compass-style.org/install/) following the instructions on that site
- Install [phantomjs](http://phantomjs.org/) and ensure `phantomjs` is on your `PATH`

### Setting up your script

To use this script, you need to make a copy of the entire repository and call it your own. Don't fork this repo; you're creating a whole new separate project using the files as a starting point.

- Clone the grunt-starter repo
- Copy it to a new directory for your website without the `.git` folder
- Save it to your source repository of choice.

Then, from your project directory:

- Install all local dependencies (`npm install`)

Building the site
-----------------

From your project directory

- `grunt` (`grunt.cmd` on Windows)

This builds the development build of your site by default. You will see the final output in `public.dev/www`.

Entering this command again will perform an incremental build so that only changed files get built to the output, reducing the time taken to see your changes.

### A tour of the output

TODO

### Build commands

- `grunt clean` will delete all output
- `grunt rebuild` will perform a full rebuild of your site.
- `grunt production` will build a release build of your site to `public\www`
- `grunt watch` will build incrementally continuously as you edit your files. (This feature may not work reliably at present. YMMV)
- `grunt notest` Will do a default dev build with no unit testing. Runs a bit faster than a normal build.

### A note on source-maps

You may notice that source maps do not work out of the box. This is because there's a hard link between the map file and the URL of the source JS which is automatically copied to the output in development builds.

In order to enable source maps, you should be accessing your local files via a local development server. Once this is done, you will need to tweak the build script to link to the correct path in your map files. E.g. if your development server is accessing `public.dev/www` on the URL

    http://127.0.0.1/mywebsite

Then you need to edit the `maplink` task in the script, adding in your top-level subfolder, e.g.

    maplink: {
        dev: {
            src: '<%= vars.out %>/js',
            rootpath: '/mywebsite/js',
            srcroot: '<%= vars.out %>/js',
            badmaproot: tmp,
            goodmaproot: '/mywebsite/mappedsrc'
        }
    }

Note that `mywebsite` is added in 2 places in that task configuration.


Editing your site
=================

TODO


Adding unit tests
-----------------

TODO

Adding JavaScript modules
-------------------------

TODO

Note: Remember to explain how to minify inline JS.


Adding pages, stylesheets and static files
------------------------------------------

TODO

Adding sprite sheets
--------------------

TODO

Adding templates
----------------

TODO

Customizing the script
======================

TODO
