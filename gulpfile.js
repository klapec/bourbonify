var gulp          = require('gulp');
var gutil         = require('gulp-util');
var browserSync   = require('browser-sync');
var del           = require('del');
var jshintStylish = require('jshint-stylish');
var $             = require('gulp-load-plugins')();

var basePath = {
  src   : 'assets/src/',
  dest  : 'assets/public/'
};

var srcAssets = {
  markup        : '*.html',
  styles        : basePath.src + 'stylesheets/',
  scripts       : basePath.src + 'scripts/',
  vendorScripts : basePath.src + 'scripts/vendor/',
  images        : basePath.src + 'images/**/*'
};

var destAssets = {
  styles        : basePath.dest + 'stylesheets/',
  scripts       : basePath.dest + 'scripts/',
  vendorScripts : basePath.dest + 'scripts/',
  images        : basePath.dest + 'images/'
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
  var cssStack = $.filter(['bourbon/**/*', 'neat/**/*', 'bitters/**/*', 'normalize.css/**/*']);
  var jquery = $.filter('jquery/dist/jquery.js');
  var stream = gulp.src('bower_components/**/*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe(cssStack)
    .pipe(gulp.dest(srcAssets.styles + 'vendor'))
    .pipe(cssStack.restore())
    .pipe(jquery)
    .pipe(gulp.dest(srcAssets.scripts + 'vendor'))
    .pipe(jquery.restore());
    return stream;
});

gulp.task('depsFix', ['depsInstall'], function() {
  var stream = gulp.src([srcAssets.styles + 'vendor/normalize.css/normalize.css'])
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.rename('normalize.scss'))
    .pipe(gulp.dest(srcAssets.styles + 'vendor/normalize.css'));
    return stream;
});

gulp.task('default', ['styles', 'scripts', 'vendorScripts', 'images'],  function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch(srcAssets.markup, ['markup', browserSync.reload]);
  gulp.watch(srcAssets.styles + '**/*.scss', ['styles', browserSync.reload]);
  gulp.watch(srcAssets.scripts + '*.js', ['scripts', browserSync.reload]);
  gulp.watch(srcAssets.vendorScripts + '**/*.js', ['vendorScripts', browserSync.reload]);
  gulp.watch(srcAssets.images, ['images', browserSync.reload]);
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
  return gulp.src(srcAssets.styles + 'main.scss')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.sass({
      precision: 6
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe($.minifyCss())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(destAssets.styles))
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
    .pipe(gulp.dest(destAssets.scripts))
    .pipe($.notify({
        title: "Scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('vendorScripts', function() {
  return gulp.src(srcAssets.vendorScripts + '**/*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.concat('vendor.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(destAssets.vendorScripts))
    .pipe($.notify({
        title: "Vendor scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('images', function() {
  return gulp.src(srcAssets.images)
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.changed(destAssets.images))
    .pipe($.imagemin({
      optimizationLevel: 1,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(destAssets.images))
    .pipe($.notify({
        title: "Images optimized",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('clean', function() {
  return del(['assets/public/*', 'assets/src/scripts/vendor/*', 'assets/src/stylesheets/vendor/*', 'bower_components'], { read: false });
});
