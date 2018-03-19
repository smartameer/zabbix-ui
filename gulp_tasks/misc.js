const path = require('path');
const gulp = require('gulp');
const del = require('del');
const filter = require('gulp-filter');
const mainBowerFiles = require('main-bower-files');

const conf = require('../conf/gulp.conf');

gulp.task('clean', clean);
gulp.task('other', other);
gulp.task('fonts', fonts);

function clean() {
  return del([conf.paths.dist, conf.paths.tmp]);
}

function other() {
  const fileFilter = filter(file => file.stat.isFile());

  return gulp.src([
    path.join(conf.paths.src, '/**/*'),
    path.join(`!${conf.paths.src}`, '/**/*.{scss,js,html}')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(conf.paths.dist));
}

function fonts() {
  return gulp.src([
      'bower_components/bootstrap-sass/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}',
      'bower_components/components-font-awesome/**/*.{eot,svg,ttf,woff,woff2}'
    ])
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/fonts/')))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
}
