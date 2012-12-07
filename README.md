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
- Install [pngout](http://advsys.net/ken/utils.htm) and make sure it's on your PATH
- Install [java](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and make sure `java` is on your PATH
- Install [ruby](http://www.ruby-lang.org) and make sure `ruby` is on your PATH
- Install [compass](http://compass-style.org/install/) following the instrunctions on that site
- Install [phantomjs](http://phantomjs.org/) and ensure `phantomjs` is on your PATH

### Setting up your script

To use this script, you need to make a copy of the entire repository and call it your own. Don't fork this repo; you're creating a whole new separate project using the files as a starting point.

- Clone the grunt-starter repo
- Copy it to a new directory for your website without the .git folder
- If you like, create a new repository from your new folder.

From your project directory:

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
- `grunt rebuildproduction` will perform a full rebuild of the release build of your site to `public\www`
- `grunt watch` will build incrementally continuously as you edit your files. (This feature may not work reliably at present. YMMV)

Editing your site
=================

TODO


Adding unit tests
-----------------

TODO

Adding JavaScript modules
-------------------------

TODO

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
