var gulp = require('gulp');
var browserSync = require('browser-sync');
var spa = require('browser-sync-spa');

var browserSyncConf = require('../conf/browsersync.conf');
var browserSyncDistConf = require('../conf/browsersync-dist.conf');

browserSync.use(spa());

gulp.task('browsersync', browserSyncServe);
gulp.task('browsersync:dist', browserSyncDist);

function browserSyncServe(done) {
  browserSync.init(browserSyncConf());
  done();
}

function browserSyncDist(done) {
  browserSync.init(browserSyncDistConf());
  done();
}
