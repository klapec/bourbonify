# bourbonify

## Description
Simple boilerplate for quickly setting up a static site.

By default there are included:

- [Normalize.css](http://necolas.github.io/normalize.css/), a modern alternative to CSS resets,
- [Bourbon](http://bourbon.io), a simple and lightweight mixin library for [Sass](http://sass-lang.com),
- [Neat](http://neat.bourbon.io), a lightweight and semantic grid framework for [Sass](http://sass-lang.com) and [Bourbon](http://bourbon.io),
- [Gulp](http://gulpjs.com), task runner with several awesome plugins,
- [jQuery](http://jquery.com), javascript library.

## How to use
1. Make sure you have ``git``, ``nodejs``, ``npm`` and ``bower`` installed,
2. Clone the repo (``git clone https://github.com/klapec/bourbonify.git``) and ``cd`` into it,
3. Run ``npm install``,
4. Run ``gulp build``,
5. Run ``gulp``.

## Gulp tasks
There are few gulp tasks present in the gulpfile.

- ``gulp build`` – downloads dependencies (Normalize.css, Bourbon and Neat) using Bower, moves them to ``assets/src/stylesheets/vendors/`` and renames Normalize so that it can be imported by Sass,
- ``gulp`` (default task) – builds all the assets (stylesheets, scripts, images and SVGs) and begins to watch all the files for changes. It will automatically re-run compilation of changed asset and reload the browser,
- ``gulp styles`` – handles stylesheets compilation. Uses **sass** (ruby-sass) to compile Sass into CSS, **autoprefixes** all the needed vendor prefixes in your CSS files, **minifies** them and outputs the compiled ``main.min.css`` to ``assets/dist/stylesheets/``,
- ``gulp scripts`` – handles JavaScript scripts. It first uses **jshint** to lint your scripts and check if there are any errors in them, it then **concatenates** all your scripts into a single file (decreasing HTTP request for performance reasons) and **minifies** it using ``uglify``,
- ``gulp vendorScripts`` – does pretty much the same as the task above. It handles vendor scripts (from ``assets/src/scripts/vendors/``) but it doesn't run them through linting – we are *assuming* that those 3rd party scripts were written properly,
- ``gulp images`` – optimizes your images. Uses **imagemin** to shrink them in size while not losing too much of quality,
- ``gulp svg`` – does pretty much the same except for your SVG files. The difference is that it automatically compiles them into a single ``sprite.svg`` file (again, performance reasons). Each of your SVG files can be accessed then in your website easily by an ID of their original name, prefixed by ``icon-``. Read more about this technique on [CSS-Tricks](http://css-tricks.com/svg-use-external-source/).

## Directory tree
```
├── assets
│   ├── dist
│   └── src
│       ├── images
│       ├── scripts
│       │   ├── main.js
│       │   └── vendors
│       ├── stylesheets
│       │   ├── base
│       │   ├── components
│       │   ├── main.scss
│       │   ├── pages
│       │   ├── partials
│       │   ├── themes
│       │   ├── utils
│       │   └── vendors
│       └── svg
├── LICENSE
├── README.md
├── bower.json
├── favicon-192x192.png
├── favicon.ico
├── gulpfile.js
├── index.html
└── package.json
```
