var gulp = require('gulp');
var eslint = require('gulp-eslint');

var conf = require('../conf/gulp.conf');

gulp.task('scripts', scripts);

function scripts() {
  return gulp.src(conf.path.src('**/*.js'))
    .pipe(eslint())
    .pipe(eslint.format())

    .pipe(gulp.dest(conf.path.tmp()));
}
