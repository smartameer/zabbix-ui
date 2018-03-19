const gulp = require('gulp');
const path = require('path');
const browserSync = require('browser-sync');
const wiredep = require('wiredep').stream;
const angularFilesort = require('gulp-angular-filesort');
const gulpInject = require('gulp-inject');

const conf = require('../conf/gulp.conf');

gulp.task('inject', inject);

function inject() {
  const injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/app/**/*.css'),
    path.join('!' + conf.paths.tmp, '/app/vendor.css')
  ], { read: false });

  const injectScripts = gulp.src([
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

  const injectOptions = {
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
