var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var angularFilesort = require('gulp-angular-filesort');
var gulpInject = require('gulp-inject');

var conf = require('../conf/gulp.conf');

gulp.task('inject', inject);

function inject() {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/app/vendor.css')
  ], { read: false });

  var injectScripts = gulp.src([
    conf.path.tmp('**/*.module.js'),
    conf.path.tmp('**/*.services.js'),
    conf.path.tmp('**/*.filter.js'),
    conf.path.tmp('**/*.factory.js'),
    conf.path.tmp('**/*.constatnts.js'),
    conf.path.tmp('**/*.directive.js'),
    conf.path.tmp('**/*.controller.js'),
    conf.path.tmp('**/*.component.js'),
    conf.path.tmp('**/*.js'),
    `!${conf.path.tmp('**/*.spec.js')}`
  ]);

  var injectOptions = {
    ignorePath: [conf.paths.src, conf.paths.tmp],
    addRootSlash: false
  };

  return gulp.src(conf.path.src('index.html'))
    .pipe(gulpInject(injectStyles, injectOptions))
    .pipe(gulpInject(injectScripts, injectOptions))
    .pipe(wiredep(Object.assign({}, conf.wiredep)))
    .pipe(gulp.dest(conf.paths.tmp))
    .pipe(browserSync.stream());
}
