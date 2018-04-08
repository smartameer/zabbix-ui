var gulp = require('gulp');
var filter = require('gulp-filter');
var useref = require('gulp-useref');
var lazypipe = require('lazypipe');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var sourcemaps = require('gulp-sourcemaps');
var uglifySaveLicense = require('uglify-save-license');
var inject = require('gulp-inject');
var ngAnnotate = require('gulp-ng-annotate');

var conf = require('../conf/gulp.conf');

gulp.task('build', build);

function build() {
  var partialsInjectFile = gulp.src(conf.path.tmp('templateCacheHtml.js'), {read: false});
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: conf.paths.tmp,
    addRootSlash: false
  };

  var htmlFilter = filter(conf.path.tmp('*.html'), {restore: true});
  var jsFilter = filter(conf.path.tmp('**/*.js'), {restore: true});
  var cssFilter = filter(conf.path.tmp('**/*.css'), {restore: true});

  return gulp.src(conf.path.tmp('/index.html'))
    .pipe(inject(partialsInjectFile, partialsInjectOptions))
    .pipe(useref({}, lazypipe().pipe(sourcemaps.init, {loadMaps: true})))
    .pipe(jsFilter)
    .pipe(ngAnnotate())
    .pipe(uglify({preserveComments: uglifySaveLicense})).on('error', conf.errorHandler('Uglify'))
    .pipe(rev())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(cssnano())
    .pipe(rev())
    .pipe(cssFilter.restore)
    .pipe(revReplace())
    .pipe(sourcemaps.write('maps'))
    .pipe(htmlFilter)
    .pipe(htmlmin())
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(conf.path.dist()));
}
