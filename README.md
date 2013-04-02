Grunt Starter
=============

[![NPM version](https://badge.fury.io/js/grunt-starter.png)](http://badge.fury.io/js/grunt-starter)

The ultimate starter skeleton for your new website. Out of the box, you get a build script that generates a compact website. Check out this list of awesome features:

- Stylesheets using SCSS, built with Compass
- Incremental builds
- Generated spritesheets
- Fully AMD-compliant with CDN fallbacks for major libraries ([Require.js](http://requirejs.org/))
- JavaScript compiled into compressed, single-download modules ([Closure](https://developers.google.com/closure/compiler/))
- jQuery and lodash (underscore) out of the box
- Precompiled, AMD-compliant handlebar templates
- Minified CSS ([clean-css](https://github.com/GoalSmashers/clean-css))
- CSS reset out of the box ([Normalize](http://necolas.github.com/normalize.css/) & [H5BP](http://www.html5boilerplate.com/))
- Browser unit testing using phantomjs, mocha and chai

To build
--------

```bash
npm install -g grunt-cli
npm install
bower install
```

Then  one of:

```bash
grunt
grunt production
grunt watch
```

Output is a small, kitchen-sink nonsensical demo site.
