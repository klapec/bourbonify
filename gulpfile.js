var gulp          = require('gulp');
var gutil         = require('gulp-util');
var browserSync   = require('browser-sync');
var del           = require('del');
var jshintStylish = require('jshint-stylish');
var sass          = require('gulp-ruby-sass');
var $             = require('gulp-load-plugins')();

var basePath = {
  src   : 'assets/src/',
  dist  : 'assets/dist/'
};

var srcAssets = {
  markup        : '*.html',
  styles        : basePath.src + 'stylesheets/',
  scripts       : basePath.src + 'scripts/',
  vendorScripts : basePath.src + 'scripts/vendors/',
  images        : basePath.src + 'images/',
  svg           : basePath.src + 'svg/'
};

var distAssets = {
  styles        : basePath.dist + 'stylesheets/',
  scripts       : basePath.dist + 'scripts/',
  vendorScripts : basePath.dist + 'scripts/',
  images        : basePath.dist + 'images/',
  svg           : basePath.dist + 'svg/'
};

function errorAlert(err) {
  $.notify.onError({
    title: "Gulp Error",
    message: "Check your terminal",
    sound: "Basso"
  })(err);
  gutil.log(gutil.colors.red(err.toString()));
  this.emit("end");
}

gulp.task('build', ['depsDownload', 'depsInstall', 'depsFix'], function() {
  $.notify({
      title: "Dependencies installed",
      message: "<%= file.relative %>",
      sound: "Glass"
  });
});

gulp.task('depsDownload', function() {
  var stream = gulp.src('bower.json')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.install());
    return stream;
});

gulp.task('depsInstall', ['depsDownload'] ,function() {
  var stream = gulp.src('bower_components/**/*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe(gulp.dest(srcAssets.styles + 'vendors'))
    return stream;
});

gulp.task('depsFix', ['depsInstall'], function() {
  var stream = gulp.src([srcAssets.styles + 'vendors/normalize.css/normalize.css'])
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.rename('_normalize.scss'))
    .pipe(gulp.dest(srcAssets.styles + 'vendors/normalize.css'));
    return stream;
});

gulp.task('default', ['styles', 'scripts', 'vendorScripts', 'images'],  function() {
  browserSync({
    server: {
      baseDir: "./"
    },
    notify: false
  });
  gulp.watch(srcAssets.markup, ['markup', browserSync.reload]);
  gulp.watch(srcAssets.styles + '**/*', ['styles', browserSync.reload]);
  gulp.watch(srcAssets.scripts + '*', ['scripts', browserSync.reload]);
  gulp.watch(srcAssets.vendorScripts + '**/*', ['vendorScripts', browserSync.reload]);
  gulp.watch(srcAssets.images, ['images', browserSync.reload]);
  gulp.watch(srcAssets.svg + '**/*', ['svg', browserSync.reload]);
});

gulp.task('markup', function() {
  return gulp.src(srcAssets.markup)
    .pipe($.notify({
        title: "Markup refreshed",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('styles', function() {
  return sass(srcAssets.styles) 
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Android >= 4']
    }))
    .pipe($.minifyCss())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(distAssets.styles))
    .pipe($.notify({
        title: "Stylesheets recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('scripts', function() {
  return gulp.src(srcAssets.scripts + '*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(distAssets.scripts))
    .pipe($.notify({
        title: "Scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('vendorScripts', function() {
  return gulp.src(srcAssets.vendorScripts + '**/*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.concat('vendors.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(distAssets.vendorScripts))
    .pipe($.notify({
        title: "Vendor scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('images', function() {
  return gulp.src(srcAssets.images + '**/*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.changed(distAssets.images))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(distAssets.images))
    .pipe($.notify({
        title: "Images optimized",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('svg', function() {
  return gulp.src(srcAssets.svg + '*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.changed(distAssets.svg))
    .pipe($.imagemin())
    .pipe($.svgstore({ fileName: 'sprite.svg', prefix: 'icon-' }))
    .pipe(gulp.dest(distAssets.svg))
    .pipe($.notify({
        title: "SVGs optimized",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('clean', function() {
  return del(['assets/dist/*', 'assets/src/scripts/vendors/*', 'assets/src/stylesheets/vendors/*', 'bower_components'], { read: false });
});
