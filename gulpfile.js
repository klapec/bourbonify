var gulp = require('gulp');
var browserSync = require('browser-sync');
var jshintStylish = require('jshint-stylish');
var $ = require('gulp-load-plugins')();

gulp.task('build', ['html', 'styles', 'scripts'], function() {});

gulp.task('default', ['build'],  function() {
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
