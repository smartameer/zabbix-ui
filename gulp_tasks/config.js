const gulp = require('gulp');
const conf = require('../conf/gulp.conf');
const gulpNgConfig = require('gulp-ng-config');

gulp.task('config', config);

function config() {
    var env = {
        environment: 'development',
        createModule: false
    };
    if (process.argv[3]) {
        switch (process.argv[3]) {
            case '--prod':
                env = {
                    environment: 'production',
                    createModule: false
                };
                break;
            case '--dev':
            default:
                env = {
                    environment: 'development',
                    createModule: false
                };
                break;
        }
    }
    return gulp.src('env.json')
        .pipe(gulpNgConfig('zabbix', env))
        .pipe(gulp.dest(conf.paths.src))
}
