var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
var jshintStylish = require('jshint-stylish');
var $ = require('gulp-load-plugins')();

gulp.task('build', ['depsDownload', 'depsInstall', 'depsFix'], function() {});

gulp.task('depsDownload', function() {
  var stream = gulp.src('bower.json')
    .pipe($.install());
    return stream;
});

gulp.task('depsInstall', ['depsDownload'] ,function() {
  var cssStack = $.filter(['bourbon/**/*', 'neat/**/*', 'normalize.css/**/*']);
  var jquery = $.filter('jquery/dist/jquery.js');
  var stream = gulp.src('bower_components/**/*')
    .pipe(cssStack)
    .pipe(gulp.dest('assets/css/1-vendor'))
    .pipe(cssStack.restore())
    .pipe(jquery)
    .pipe(gulp.dest('assets/js/vendor'))
    .pipe(jquery.restore());
    return stream;
});

// Sass doesn't yet support importing css as sass files
// https://github.com/sass/sass/issues/556
// This task is needed for normalize to be properly imported into our project
gulp.task('depsFix', ['depsInstall'], function() {
  var stream = gulp.src(['assets/css/1-vendor/normalize.css/normalize.css'])
    .pipe($.rename('_normalize.scss'))
    .pipe(gulp.dest('assets/css/1-vendor/normalize.css'));
    return stream;
});

gulp.task('default', ['html', 'styles', 'scripts', 'images'],  function() {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });
  gulp.watch('index.html', ['html', browserSync.reload]);
  gulp.watch('assets/css/**/*.scss', ['styles', browserSync.reload]);
  gulp.watch('assets/js/*.js', ['scripts', browserSync.reload]);
  gulp.watch('assets/img/**/*', ['images', browserSync.reload]);
});

gulp.task('html', function() {
  var stream = gulp.src('index.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
  return stream;
});

gulp.task('styles', function() {
  return gulp.src('assets/css/main.scss')
    .pipe($.rubySass({
      style: 'expanded',
      precision: 3
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe($.minifyCss())
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
  var vendor = $.filter('vendor/**/*.js');
  var custom = $.filter(['*.js', '!vendor.min.js']);

  return gulp.src('assets/js/**/*.js')
    .pipe(vendor)
    .pipe($.concat('vendor.min.js'))
    .pipe($.uglify())
    .pipe(vendor.restore())
    .pipe(custom)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.min.js'))
    .pipe($.uglify())
    .pipe(custom.restore())
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('assets/img/**/*')
    // .pipe($.size({
    //   showFiles: true,
    //   title: "Images size before optimizing:"
    // }))
    // .pipe($.cache($.imagemin({
    //   optimizationLevel: 1,
    //   progressive: true,
    //   interlaced: true
    // })))
    .pipe(gulp.dest('dist'));
    // .pipe($.size({
    //   showFiles: true,
    //   title: "Images size after optimizing:"
    // }));
});

gulp.task('clean', function() {
  return del(['dist', 'assets/css/1-vendor/*', '!assets/css/1-vendor/_1-dir.scss', 'assets/js/vendor/*', 'assets/js/main.min.js', 'assets/js/vendor.min.js', 'bower_components'], { read: false });
});
